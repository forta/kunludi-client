"use strict";

//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: internal functions

/*

Partimos de 1436 líneas y 68000 chars en versión v0.01 y vamos a recodificar para v0.02
(Por ahora v0.02: 13109 lineas y 61173 chars)
IT_*: 129
IT_GetAttPropValue: 19
IT_SetAttPropValue: 4
IT_GetLoc: 10
IT_X: 96  !!!!!!!!!!
IT_SetLoc o lib.IT_SetLocToLimo: 13
IsCarried o IT_IsHere: 3
194 líneas con CA_
178 líneas con GD_
9 PC_
7 DIR_
getValue: 27 líneas
setValue: 22 líneas

Atributo por defecto:
v0.01:
	Llamada a libCode, en enlaces, equivale a lib.executeCode
	Llamada a usrCode, en enlaces, equivale a usr.executeCode
 	lib.IT_GetAttPropValue (item, "generalState", "state") (61 chars)
	lib.executeCode ("getValue", {id}) // sólo implementado para getValue -> IT_GetAttPropValue

v0.02: Guía para pasar a lib2 lo juegos con lib v0.01:
	#1: renombramos primitives a lib
	#2: acortamos lib.executeCode a lib.it
	#3: no se usarán funciones IT
	lib.it ("att", [item], "") (26 chars, 42% menos que v0.01)
	Funciones para el usuario, usadas por los enlaces:
	usr.att ([item, ""]) (20 chars, 33%)
	#4: más adelante, hacer lo mismo con los output CA_ y DEF_
	#5: usar "att" independientemente de si es para convesión de tipo, getValue o setValue
	  lib.it ("att", [item]) <-> IT_X o IT_GetId
		lib.it ("att", [item, ""])  <-> IT_GetAttPropValue
		lib.it ("att", [item, "", "1"]) <-> IT_SetAttPropValue
	#6: si hacemos que el cambio de valor devuelva el valor, se puden reducir código. en vez de :
	# inc att de item1 y copiarlo a item2
		att("perro", "", "1")
		v = att("perro", "")
		att(item2, "", v)
	sería!!::
		att(item2, "", att("perro", "", "1"))


Método:
	1 Ir reemplazar funciones IT de este fichero por llamadas a lib.it
	2 Al terminar, reemplazar funciones CA de este fichero por llamadas a lib.out
	3 Usar en los enlaces la acción activatedBy, para dar persistencia a las elecciones, vinculándolas al estado de ítems.

Brainstorming: debido a los interfaces externos que no queremos que el usuario pueda tocar...
	1 ¿Se podría hacer que el gReactions.js del usuario se montara encima de la plantilla que no queremos que el usuario puda usar?
  2 El juego del usuarios consistiría en (que sería muy fácil de explicar en la documentación):
	3 El usuario no debería usar usr.att() sino directamente att()  !!!
	4 Para el resto: ¿lib.it () o sólo it()?

	reactions = []
	reactions.push ({...})
	items = []
	items.push ({...})
  turn()
	y atributtes
  usr: { funciones y variables no persistentes de usuario }

	En la carga del módulo, simplemente se cargarían las reacciones, ítems, función del turno de máquina y las funciones del usuario.
	Esto facilitaría la lectura del juego y los haría más seguros al meterlos en el servidor.
	También facilita modificar todas las plantillas de golpe, en vez de ir de una a una.

	En vez de:
	let gameReactions = require ('../../data/games/' + gameId + ((subgameId != "")? '/' + subgameId  : "") + '/gReactions.js').default;
	Sería:
	let gameReactions =  require ('../components/libs/' + libVersion + '/userTemplate.js').default;
  let gameReactions.usr = require ('../../data/games/' + gameId + ((subgameId != "")? '/' + subgameId  : "") + '/gReactions.js').default;

	Habría que hacer que las referencias externas a gameReactions.reactions, gameReactions.items, gameReactions.turn  fueran a gameReactions.usr.X

  to-do: prueba de concepto
	paso 1: meter reactions, items y turn en usr. también podría ir alguna función "alias" como usr.exec ("getValue",
	paso 2: hacer que el juego funcione con este cambio
	paso 3: usar plantilla y que ahora gReactions.js sólo fuera el usr

Atributos usados en el juego:

porche
hab_padres: 1 cuando haya observado el espejo
hab_niños: 1 cuando haya dado queso al ratónote
hab_abuelo: 1 cuando haya entrado en el ataúd
cuadro1: 1 cuando lo haya observado
chimenea: 1 cuando haya observado la chimenea
dinamita.loc: en limbo significa que ha vivido la escena de la guerra
poster: 1 cuando ha leído la canción del póster
botella: 1 abierta; 2 cuando te has huntado las manos con la sangre

*/

let items = []
let reactions = []
let attributes = []
let userFunctions = []

export default {
	// mandatory
	dependsOn:dependsOn,
	turn: turn,
	initItems: initItems,
	initReactions: initReactions,
	initAttributes: initAttributes,
	initUserFunctions:initUserFunctions, // user code definition

	items:items,
	reactions:reactions,
	attributes:attributes,
	userFunctions:userFunctions,

	exec:exec, // user code execution (it will be it, pc?, ac, gd, dir)

}

function dependsOn (lib, usr) {
	this.lib = lib
	this.usr = usr
}

function turn (indexItem) {

	if (indexItem != this.lib.IT_X("hall")) return
	if (this.usr.exec ("getValue", {id:"intro2"}) == "1") return

	if (this.usr.exec ("escenas_pendientes") != "done") return

	this.usr.exec ("escenaFinal")

}

function exec(functionName, par) {

	let indexUsrFunction = this.lib.arrayObjectIndexOf_2(this.userFunctions, "id", functionName);
	if (indexUsrFunction<0) {
		console.log ("missing functionName [" + functionName + "] in executeCode")
		return
	}
  return userFunctions[indexUsrFunction].code (par)

}


function initItems (lib, usr) {

/*
	items.push ({
		id: 'móvil',

		desc: function () {
			lib.CA_ShowMsg ("móvil")

		}

	});
*/

items.push ({
	id: 'intro1',

	desc: function () {

		lib.CA_EnableChoices(false)

		lib.GD_CreateMsg ("es","tecla","avanza")

		lib.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Intruso, participante en la %l1.<br/>Correcciones hechas a fecha de 17 de noviembre, disculpen los bugs previos y gracias por los comentarios!<br/>");
		lib.GD_CreateMsg ("es","Intro1", "Antes de comenzar el juego, hay algunas %l1 que deberías conocer previamente.<br/>");
		lib.GD_CreateMsg ("es","Intro2", "Pero si ya las conoces, puedes empezar a %l1 directamente.<br/>");
		lib.GD_CreateMsg ("es","Intro3", "Disfruta de la partida.<br/>");
		lib.GD_CreateMsg ("es", "Consideración0", "Si ya has jugado anteriormente a juegos desarrollados con el motor de kunludi ya sabrás que la interacción se realiza con las opciones disponibles después del texto de la última reacción. Cuando la acción no es directa, primero tienes que seleccionar el objeto sobre el que quieres actuar y luego la acción a desarrollar.%l1<br/>");
		lib.GD_CreateMsg ("es", "Consideración1", "En esta versión del motor, se han incorporado enlaces en los textos, simulando un poco el estilo Twine/Inkle. %l1<br/>");
		lib.GD_CreateMsg ("es", "Consideración2", "También se ha incorporado un filtro para los los ítems y acciones disponibles. Si pulsas 'enter' mientras editas el filtro, se ejecutará la primera de las opciones disponibles. Es una forma muy dinámica de interacturar (al menos por web) y te animamos a usarla.%l1<br/>");

		let intro0 = lib.CA_ShowMsg ("Intro0", {l1: {id: "intro0", txt: "ectocomp 2021"}});
		let intro1 = lib.CA_ShowMsg ("Intro1", {l1: {id: "intro1", txt: "consideraciones de jugabilidad"}});
		let intro2 = lib.CA_ShowMsg ("Intro2", {l1: {id: "intro2", txt: "jugar"}});
		let intro3 = lib.CA_ShowMsg ("Intro3", undefined, false);
		let consi0 = lib.CA_ShowMsg ("Consideración0", {l1: {id: "consi0", txt: "sigue leyendo"}}, false)
		let consi1 = lib.CA_ShowMsg ("Consideración1", {l1: {id: "consi1", txt: "sigue leyendo"}}, false)
		let consi2 = lib.CA_ShowMsg ("Consideración2", {l1: {id: "consi2", txt: "El juego comienza"}}, false)

		lib.GD_DefAllLinks ([
			{ id:intro0, url: "https://itch.io/jam/ectocomp-2021-espanol"},
			{ id:intro1, visibleToFalse: [intro2], changeTo: consi0},
			{ id:intro2, visibleToFalse: [intro1], changeTo: intro3,
				action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}
				//userCode: {functionId: "goto", par: {target:"intro2"} }
			},
			{ id:consi0, changeTo: consi1},
			{ id:consi1, changeTo: consi2},
			{ id:consi2, changeTo: intro3, 	action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}}
		])



	}

});

items.push ({
	id: 'intro2',

	desc: function () {


		lib.GD_CreateMsg ("es", "escena_inicial_1", "Es sólo entrar y salir. Localizar el dichoso trofeo, sacarle una foto y salir pitando.<br/>");
		lib.GD_CreateMsg ("es", "escena_inicial_2", "Sabes que la familia Rarita va a salir a celebrar la noche de Halloween fuera de casa. Escondido detrás de un arbusto en su ruinoso jardín, los acabas de ver desfilar delante tuyo, con unas pintas que por una vez al año no desentona con la del resto.<br/>")
		lib.GD_CreateMsg ("es", "escena_inicial_3", "¿Cómo has podido dejarte enredar en esto?<br/>");

		lib.CA_ShowMsg ("escena_inicial_1")
		lib.CA_ShowMsg ("escena_inicial_2")
		lib.CA_ShowMsg ("escena_inicial_3")

		lib.CA_PressKey ("tecla");

		lib.GD_CreateMsg ("es", "flashback_1", "Flashback. Ayer noche. Reunión semanal de colegas de rol-o-lo-que-surja<br/>");
		lib.GD_CreateMsg ("es", "flashback_21", "Bela: Venga, tira tu carta ya, ¡que nos aburrimos! No seas gallina, no creo que te vaya a salir 'desafío'.<br/>")
		lib.GD_CreateMsg ("es", "flashback_22", "Lanzas las cartas y...<br/>")
		lib.GD_CreateMsg ("es", "flashback_23", "Tú: ¿¡Qué...!? La muy de Bela, gafe no, gafona, pájaro de mal agüero.<br/>")
		lib.GD_CreateMsg ("es", "flashback_24", "Todos (voces solapadas): ¡No jodas! ¡Bien! ¡Ya era hora de que te tocara! ¡Somos ricos!<br/>")
		lib.GD_CreateMsg ("es", "flashback_25", "Tú: Un momento. aún tengo una oportunidad.<br/>")
		lib.GD_CreateMsg ("es", "flashback_26", "Truda: Tú sueñas. Vamos equipo, a deliberar. Tú, por favor, sale de la habitación un momento.<br/>")
		lib.GD_CreateMsg ("es", "flashback_31", "Por mucho que pegaste el oído a la puerta sólo oíste sus risas. Luego, cuando volviste a entrar:<br/>")
		lib.GD_CreateMsg ("es", "flashback_32", "Fiulo: Hemos decidido que si quieres retener tu mazo de cartas deberás superar este reto:<br/>")
		lib.GD_CreateMsg ("es", "flashback_4", "Tienes que entrar en la casa de Los Raritos y salir con una foto de la mascota del menor de La Familia Rarita.<br/>")
		lib.GD_CreateMsg ("es", "flashback_5", "Sales de tu ensimismamiento.<br/>");
		lib.GD_CreateMsg ("es", "flashback_6", "Ahora que acaban de subirse a su coche fúnebre de cristales oscuros, sabes que ha llegado el momento de entrar. Tu corazón late a mil por hora, los músculos se tensan, así que...<br/>")

		lib.CA_ShowMsg ("flashback_1")
  	lib.CA_PressKey ("tecla");
		lib.CA_ShowMsg ("flashback_21")
		lib.CA_ShowMsg ("flashback_22")
		lib.CA_ShowMsg ("flashback_23")
		lib.CA_ShowMsg ("flashback_24")
		lib.CA_ShowMsg ("flashback_25")
		lib.CA_ShowMsg ("flashback_26")
		lib.CA_PressKey ("tecla");
		lib.CA_ShowMsg ("flashback_31")
		lib.CA_ShowMsg ("flashback_32")
		lib.CA_PressKey ("tecla");
		lib.CA_ShowMsg ("flashback_4")
		lib.CA_PressKey ("tecla");
		lib.CA_ShowMsg ("flashback_5")
		lib.CA_PressKey ("tecla");
		lib.CA_ShowMsg ("flashback_6")

		lib.GD_CreateMsg ("es", "corre", "¡%l1!<br/>")
		let msg_corre = lib.CA_ShowMsg ("corre", {l1: {id: "corre", txt: "CORRE"}})

		lib.GD_DefAllLinks ([
			{ id: msg_corre, 	action: { choiceId: "action", actionId:"goto", o1Id: "porche"}}
		])

		/*
		lib.GD_CreateMsg ("es", "DLG_test", "test")
		lib.CA_QuoteBegin ("Nadie", "DLG_test" , undefined, true ); // error: [    ]
		lib.CA_ShowMsg ("<br/>")
		*/

	}

});

items.push ({
	id: 'porche',

	desc: function () {

		lib.GD_CreateMsg ("es","desc-porche-1", "Las telarañas del sofá colgante son frondosas, pero no decorativas precisamente. Si aquí en el exterior está todo tan mugriento, no quieras ni imaginarte cómo estarán las cosas %l1.<br/>");
		let dentro = lib.CA_ShowMsg ("desc-porche-1", {l1: {id: "dentro", txt: "dentro"}})

		if (lib.IT_GetAttPropValue (lib.IT_X(id), "generalState", "state") == "0") {  // primera vez
			lib.GD_CreateMsg ("es","desc-porche-2", "Sólo estás armado con el %l1 vintage que te dejaron tus amigos.<br/>");

			let msg_movil = lib.CA_ShowMsg ("desc-porche-2", {l1: {id: "móvil", txt: "móvil"}})
			lib.GD_DefAllLinks ([
				{ id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: lib.IT_X("hall"), targetId: "hall", d1Id:"in", d1: lib.DIR_GetIndex("in")}},
			  { id:msg_movil, action: { choiceId: "obj1", o1Id: "móvil"}}
			])

			lib.GD_CreateMsg ("es","desc-porche-3", "Por el rabillo del ojo vez algo deslizarse. Al enfocar  la vista ves un surco sobre el descuidado césped que va desde donde viste el movimiento hasta un agujero debajo de una de las paredes externas de la casa.<br/>");
			lib.CA_ShowMsg ("desc-porche-3")

			lib.IT_SetLoc(lib.IT_X("móvil"), lib.PC_X());
			lib.IT_SetAttPropValue (lib.IT_X(id), "generalState", "state", "1")

			lib.CA_EnableChoices(true)
		} else {
			lib.GD_DefAllLinks ([
			  { id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: lib.IT_X("hall"), targetId: "hall", d1Id:"in", d1: lib.DIR_GetIndex("in")}}
			])
		}

	}

});



	items.push ({
		id: 'hall',

		desc: function () {

			// debug: sólo por si en pruebas empezamos aquí.
			lib.GD_CreateMsg ("es","tecla","avanza")
			lib.IT_SetLoc(lib.IT_X("móvil"), lib.PC_X());

			lib.GD_CreateMsg ("es","desc_hall_0", "Dejas detrás de ti la puerta exterior. Sabes que salir representa resignarte a la burla de tus amigos y perder tu fabuloso mazo de cartas.<br/>");
			lib.CA_ShowMsg ("desc_hall_0");

			let huesosVisto = (usr.exec("getValue", {id:"huesos"}) != "0")

			lib.GD_CreateMsg ("es","desc_hall_1", "Una inmensa %l1 domina uno de los laterales del salón. ");
			lib.GD_CreateMsg ("es","desc_hall_a_cocina", "Por el otro lateral, atravesando el comedor, entrevés una puerta que seguramente %l1.<br/>");

			lib.GD_CreateMsg ("es","desc_hall_2", "A través de un magnífica escalera con tapete, que sería rojo si no fuera por las marcas de %l1, ");
			lib.GD_CreateMsg ("es","desc_hall_2_plus", " no sólo de personas sino también de animales de distintos tamaños y que no identificas, ");
			lib.GD_CreateMsg ("es","desc_hall_3", " podrías %l1.");

			let desc_hall_1 = lib.CA_ShowMsg ("desc_hall_1", {l1:{id: "desc_hall_1", txt: "chimenea"}}, !huesosVisto)
			let desc_hall_a_cocina = lib.CA_ShowMsg ("desc_hall_a_cocina", {l1:{id: "desc_hall_a_cocina", txt: "lleva a la cocina"}})
			let desc_hall_2 = lib.CA_ShowMsg ("desc_hall_2", {l1:{id: "desc_hall_2", txt: "pisadas"}})
			let desc_hall_2_plus = lib.CA_ShowMsg ("desc_hall_2_plus", undefined, false)
			let desc_hall_3 = lib.CA_ShowMsg ("desc_hall_3", {l1:{id: "desc_hall_3", txt: "ir a la planta alta"}})


			lib.GD_CreateMsg ("es","interruptores_1", "Está todo bastante oscuro pero ves %l1 ");
			lib.GD_CreateMsg ("es","interruptores_2", "que están cubiertos de mugre pegajosa y no funcionan.<br/>");

			let interruptoresVisto = (usr.exec ("getValue", {id:"interruptores"}) != "0")
			let msg_interruptores_1 = lib.CA_ShowMsg ("interruptores_1", {l1:{id: "interruptores_1", txt: "algunos interruptores"}})
			let msg_interruptores_2 = lib.CA_ShowMsg ("interruptores_2", undefined, interruptoresVisto)

			lib.GD_DefAllLinks ([
				{ id: desc_hall_1, action: { choiceId: "action", actionId:"ex", o1Id: "chimenea"} } ,
				{ id: desc_hall_a_cocina, action: { choiceId: "dir1", actionId:"go", target: lib.IT_X("cocina"), targetId: "cocina", d1Id:"d270", d1: lib.DIR_GetIndex("d270")}},
				{ id: desc_hall_2, visibleToTrue: [desc_hall_2_plus]},
				{ id: msg_interruptores_1, visibleToTrue: [msg_interruptores_2], activatedBy: "interruptores" },
				{id: desc_hall_3, action: { choiceId: "dir1", actionId:"go", target: lib.IT_X("pasillo"), targetId: "pasillo", d1Id:"up", d1: lib.DIR_GetIndex("up")}}
			])

			// escena final (final feliz)
			lib.GD_CreateMsg ("es","escena-final-1", "Estás rodeado del lobo, el murciélago, el ratón, el gato y sólo falta la serpiente para completar el zoo Rarito.<br/>");
			lib.GD_CreateMsg ("es","escena-final-2", "En ese momento, suena el teléfono: ¡Los Raritos están llegando, corre!<br/>");
			lib.GD_CreateMsg ("es","escena-final-3", "Al ir a la puerta, aparece la serpiente que se levanta y te corta el camino.<br/>");
			lib.GD_CreateMsg ("es","escena-final-4", "Estás atrapado! Cierras los ojos, te haces un ovillo en el suelo y te lo haces encima.<br/>");
			//<tecla>
			lib.GD_CreateMsg ("es","escena-final-5", "Al poco, oyes como un grupo de personas se aproxima cantando y haciéndo bromas de Hallowen. Entonces se abre la puerta, casi de manera imperceptible, y oyes el clic de un interruptor. Se enciende una luz respandeciente, que se cuela entre tus dedos.<br/>");
			lib.GD_CreateMsg ("es","escena-final-6", "Levantas la cabeza, te tapas torpemente la entrepierna del pantalón mojada de orín y los ves. La Familia Rarita al completo, que te observa con atención.<br/>");
			lib.GD_CreateMsg ("es","escena-final-7", "Niño Rarito deja su calabaza llena de chuches y saca un móvil.<br/>");
			//<tecla>
			lib.GD_CreateMsg ("es","escena-final-8", "Flash! Te acaba de sacar una foto?<br/>");
			lib.GD_CreateMsg ("es","escena-final-9", "La adolescente Rarita sube las escaleras escuchando la música de sus cascos y mirando su móvil, sin prestarte atención.<br/>");
			lib.GD_CreateMsg ("es","escena-final-10", "El abuelo te sonríe y te hace un gesto para que lo acompañes al exterior.<br/>");
			// <tecla>
			lib.GD_CreateMsg ("es","escena-final-11", "abuelo:<br/>");
			lib.GD_CreateMsg ("es","escena-final-12", "Hijo mío, espero que esta noche hayas aprendido la lección de que no se debe entras en casas ajenas.<br/>");
			lib.GD_CreateMsg ("es","escena-final-13", "Como recuerdo, llévate esta foto de recuerdo -> al verla con tus amigos, sales con un murciélago en tu hombro. Has conseguido el reto y no sólo conservas tu mazo de cartas sino el respeto y devoción de tus amigos.<br/>");
			//lib.CA_EndGame("escena-final-13")

		}

	});

	items.push ({
		id: 'cocina',

		desc: function () {


			lib.GD_CreateMsg ("es","desc_cocina", "Es la cocina más nauseabunda que has visto en tu vida. Te da asco tocar nada, pero una curiosidad malsana te tienta a %l1.")
			let desc_cocina =  lib.CA_ShowMsg ("desc_cocina", {l1:{id: "desc_cocina", txt: "mirar qué habrá dentro de la nevera"}})

			lib.GD_DefAllLinks ([
				{id: desc_cocina, action: { choiceId: "action", actionId:"ex", o1Id: "nevera"} }
			])


		}

	});

	items.push ({
		id: 'pasillo',

		desc: function () {

			let cuadroVisto = (usr.exec ("getValue", {id:"cuadro1"}) != 0)
			let posterVisto = (usr.exec ("getValue", {id:"póster"}) != 0)
			let espejoVisto = (usr.exec ("getValue", {id:"espejo"}) != 0)
			let ratonPresente = (lib.IT_GetLoc(lib.IT_X("ratón")) != lib.IT_X("limbo"))

			lib.GD_CreateMsg ("es","pasillo_cuadro", "Observas un %l1 con los miembros de la familia. ")
			lib.GD_CreateMsg ("es","pasillo_hab_común", "Sólo es un pasillo que conduce ");
			lib.GD_CreateMsg ("es","pasillo_hab_padres", " %l1 y sobre la que ves un escudo con un lobo que pelea con una serpiente casi tan grande como él; ");
			lib.GD_CreateMsg ("es","pasillo_hab_hijos", " %l1; ");
			lib.GD_CreateMsg ("es","pasillo_poster", ", supones por %l1 de un grupo de rock gótico a la entrada, ");
			lib.GD_CreateMsg ("es","pasillo_hab_abuelo", " y a una tercera habitación, sin nada digno de remarcar... salvo la ausencia de todo: una puerta lisa y negra, sin pomo.<br/>");

			let msg_pasillo_cuadro = lib.CA_ShowMsg ("pasillo_cuadro", {l1: {id: "pasillo_cuadro", txt: "cuadro"}}, !cuadroVisto);
			let msg_pasillo_hab_hijos_comun = lib.CA_ShowMsg ("pasillo_hab_común")

			let msg_pasillo_hab_padres = lib.CA_ShowMsg ("pasillo_hab_padres", {l1: {id: "pasillo_hab_padres", txt: "a la habitación que preside las escaleras"}}, !espejoVisto )

			let msg_pasillo_hab_hijos = lib.CA_ShowMsg ("pasillo_hab_hijos", {l1: {id: "pasillo_hab_hijos", txt: "a la habitación de los hijos"}}, ratonPresente )

			let msg_pasillo_poster = lib.CA_ShowMsg ("pasillo_poster", {l1: {id: "pasillo_poster", txt: "el póster"}}, !posterVisto & ratonPresente)
			let msg_pasillo_hab_abuelo = lib.CA_ShowMsg ("pasillo_hab_abuelo" )

			lib.GD_DefAllLinks ([
				{ id:msg_pasillo_cuadro, action: { choiceId: "action", actionId:"ex", o1Id: "cuadro1"}},
				{ id:msg_pasillo_poster, action: { choiceId: "action", actionId:"ex", o1Id: "póster"}, serCode: {functionId:'setValue', par: {id:"póster", value:"1"}} },
				{ id:msg_pasillo_hab_padres, action: { choiceId: "dir1", actionId:"go", target: lib.IT_X("hab_padres"), targetId: "hab_padres", d1Id:"d0", d1: lib.DIR_GetIndex("d0")}},
				{ id:msg_pasillo_hab_hijos, action: { choiceId: "dir1", actionId:"go", target: lib.IT_X("hab_hijos"), targetId: "hab_hijos", d1Id:"d270", d1: lib.DIR_GetIndex("d270")}}
			])

		}

	});

	items.push ({
		id: 'hab-padres',

		desc: function () {

			lib.GD_CreateMsg ("es","desc-hab-padres-1", "Qué desagradable, un crucifijo invertido preside una cama enorme, de unos tres por tres metros. La cama está sin hacer y las sábanas están llenas de manchas cuya naturaleza quizás sea mejor no saber. Un gran espejo en el techo habla de la morbosidad de sus ocupantes.<br/>");
			lib.CA_ShowMsg ("desc-hab-padres-1")

		}

	});

	items.push ({
		id: 'hab-hijos',

		desc: function () {

			// to-do: usar links
			// si das queso -> sale el ratón, coge queso, y se van ambos animales.
			// ¿qué pasa si no tienes el queso? En vez de resolverse la situación dando el queso, aparecería un objeto en la habitación que podrías usar ahí mismo: quizás debajo de la alfombra o similar.

			let ratonVisto = (usr.exec ("getValue",  {id:"ratón"}) != "0")
			let gatoVisto = (usr.exec ("getValue",  {id:"gato"}) != "0")

			lib.GD_CreateMsg ("es","desc-hab-hijos-1", "¿Una litera? No te quieres ni imaginar las peleas por el territorio entre los dos hermanos Raritos, que no dejan de pelear todo el rato en el colegio.<br/>");
			lib.GD_CreateMsg ("es","desc-hab-hijos-ratón", "Al lado de la cama inferior, hay un agujero del tamaño de una pelota de tenis en la base de la pared")
			lib.GD_CreateMsg ("es","desc-hab-hijos-ratón-presente", ", del que asoma el hocico de un %l1.");
			lib.GD_CreateMsg ("es","desc-hab-hijos-gato-presente", "En otra esquina de la habitación, entre sombras, un %l1 mira casi todo el tiempo hacia el agujero, ignorándote activamente mientras se lame las uñas. No lo podrías jurar, pero ¿tiene maquillaje en los ojos?<br/>");


			let ratonHay = lib.IT_IsHere(lib.IT_X("ratón"))
			let gatoHay = lib.IT_IsHere(lib.IT_X("gato"))

			lib.CA_ShowMsg ("desc-hab-hijos-1")
			lib.CA_ShowMsg ("desc-hab-hijos-ratón")
			let msg_raton_presente = lib.CA_ShowMsg ("desc-hab-hijos-ratón-presente", {l1: {id: "ratoncito", txt: "ratoncito"}}, ratonHay & !ratonVisto)

			lib.CA_ShowMsgAsIs (". ")
			let msg_gato_presente = lib.CA_ShowMsg ("desc-hab-hijos-gato-presente", {l1: {id: "gato", txt: "gato"}}, gatoHay & !gatoVisto)

			lib.GD_DefAllLinks ([
				{ id: msg_raton_presente, action: { choiceId: "action", actionId:"ex", o1Id: "ratón"} } ,
				{ id: msg_gato_presente,  action: { choiceId: "action", actionId:"ex", o1Id: "gato"} }
			])

		}

	});

	items.push ({
		id: 'hab-abuelos',

		desc: function () {

			lib.GD_CreateMsg ("es","desc-hab-abuelos", "Suelo y paredes de mármol, gélido y un ataúd flanqueado por dos velas inmensas encendidas. Sobre el ataúd un cuadro.<br/>");
			lib.CA_ShowMsg ("desc-hab-abuelos")

		}

	});

	items.push ({
		id: 'cuadro1',


		desc: function () {


			let familiaActivation = [
				(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "padre") == "0"),
				(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "madre") == "0"),
				(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "hija") == "0"),
				(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "hijo") == "0"),
				(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "abuelo") == "0") ]

			let bis_active = !(familiaActivation[0] || familiaActivation[1] || familiaActivation[2] || familiaActivation[3] || familiaActivation[4])


			// si no se han visto ya todos, no mostrar opciones habituales sino sólo los enlaces
			if (!bis_active) {lib.CA_EnableChoices(false)}

			lib.GD_CreateMsg ("es","el_cuadro_1", "La familia Rarita al completo: ");

			lib.GD_CreateMsg ("es","el_cuadro_2", "el %l1, ");
			lib.GD_CreateMsg ("es","el_cuadro_2_bis", "el Papá Rarito, con un lobo a sus pies; ");

			lib.GD_CreateMsg ("es","el_cuadro_3", "la %l1, ");
			lib.GD_CreateMsg ("es","el_cuadro_3_bis", "la Mamá Rarita, con una serpiente inmensa como bufanda; ");
			lib.GD_CreateMsg ("es","el_cuadro_4", "la %l1, ");
			lib.GD_CreateMsg ("es","el_cuadro_4_bis", "la Chica Rarita y su look gótico-punk, acariciando a un gato negro; ");
			lib.GD_CreateMsg ("es","el_cuadro_5", "el %l1, y ");
			lib.GD_CreateMsg ("es","el_cuadro_5_bis", "el Niño Rarito, jugando con un orondo ratón; ");
			lib.GD_CreateMsg ("es","el_cuadro_6", ", el %l1,");
			lib.GD_CreateMsg ("es","el_cuadro_6_bis", "el Abuelo Rarito, con un murciélago en el hombro;");
			lib.GD_CreateMsg ("es","el_cuadro_7", "y %l1.<br/>");
			lib.GD_CreateMsg ("es","el_cuadro_7_bis", "y una figura borrada a cuchilladas, que deja entrever a una señora mayor también con un murciélago sobre su hombro. Si existió una Abuela Rarita en la familia es algo que desconocías hasta ahora. ¿Por qué habrán querido destrozar su recuerdo de manera tan cruel?<br/>");

			lib.CA_ShowMsg ("el_cuadro_1")

			let msg_cuadro_2 = lib.CA_ShowMsg ("el_cuadro_2", {l1: {id: "cuadro_2", txt: "Papá Rarito"}}, !bis_active)
			let msg_cuadro_2_bis = lib.CA_ShowMsg ("el_cuadro_2_bis", undefined, bis_active)

			let msg_cuadro_3 = lib.CA_ShowMsg ("el_cuadro_3", {l1: {id: "cuadro_3", txt: "Mamá Rarita"}}, !bis_active)
			let msg_cuadro_3_bis = lib.CA_ShowMsg ("el_cuadro_3_bis", undefined, bis_active)
			let msg_cuadro_4 = lib.CA_ShowMsg ("el_cuadro_4", {l1: {id: "cuadro_4", txt: "Chica Rarita"}}, !bis_active)
			let msg_cuadro_4_bis = lib.CA_ShowMsg ("el_cuadro_4_bis", undefined, bis_active)
			let msg_cuadro_5 = lib.CA_ShowMsg ("el_cuadro_5", {l1: {id: "cuadro_5", txt: "Niño Rarito"}}, !bis_active)
			let msg_cuadro_5_bis = lib.CA_ShowMsg ("el_cuadro_5_bis", undefined, bis_active)
			let msg_cuadro_6 = lib.CA_ShowMsg ("el_cuadro_6", {l1: {id: "cuadro_6", txt: "Abuelo Rarito"}}, !bis_active)
			let msg_cuadro_6_bis = lib.CA_ShowMsg ("el_cuadro_6_bis", undefined, bis_active)
			let msg_cuadro_7 = lib.CA_ShowMsg ("el_cuadro_7", {l1: {id: "cuadro_7", txt: "una figura borrada a cuchilladas"}}, !bis_active)
			let msg_cuadro_7_bis = lib.CA_ShowMsg ("el_cuadro_7_bis", undefined, bis_active)

			/*
			here!
			error:
			actualmente, es setFrame el que devuelve  (status.enableChoices == true)
			lo que produce el  setEnableChoices(true)
	     Pero al pasar a setValue de libCode, ahora no hay nadie que lo haga

			*/

			lib.GD_DefAllLinks ([
				// activatedBy: cuadro1.familiaState.X

				{ id: msg_cuadro_2, changeTo: msg_cuadro_2_bis, userCode: {functionId: "setFrame", par: {pnj:"padre"} }, activatedBy: "cuadro1.familiaState.padre" },
				{ id: msg_cuadro_3, changeTo: msg_cuadro_3_bis, userCode: {functionId: "setFrame", par: {pnj:"madre"} }, activatedBy: "cuadro1.familiaState.madre" },
				{ id: msg_cuadro_4, changeTo: msg_cuadro_4_bis, userCode: {functionId: "setFrame", par: {pnj:"chica"} }, activatedBy: "cuadro1.familiaState.chica"	},
				{ id: msg_cuadro_5, changeTo: msg_cuadro_5_bis, userCode: {functionId: "setFrame", par: {pnj:"niño"} }, activatedBy: "cuadro1.familiaState.niño" 	},
				{ id: msg_cuadro_6, changeTo: msg_cuadro_6_bis, userCode: {functionId: "setFrame", par: {pnj:"abuelo"} }, activatedBy: "cuadro1.familiaState.abuelo" },
				{ id: msg_cuadro_7, changeTo: msg_cuadro_7_bis, userCode: {functionId: "setFrame", par: {pnj:"abuela"} }, activatedBy: "cuadro1.familiaState.abuela" }
			])

		}

	});


	items.push ({
		id: 'chimenea',


		desc: function () {

			let jaulaVisto = (usr.exec ("getValue",  {id:"jaula"}) != "0")

			lib.GD_CreateMsg ("es","chimenea_1", "Entre carbón y madera quemada observas los restos de %l1.");
			lib.GD_CreateMsg ("es","chimenea_1_bis", "Entre carbón y madera quemada observas los restos de una jaula chamuscada. ");

			let msg_chimenea_1 = lib.CA_ShowMsg ("chimenea_1", {l1: {id: "chimenea_1", txt: "una jaula chamuscada"}}, !jaulaVisto)
			let msg_chimenea_1_bis = lib.CA_ShowMsg ("chimenea_1_bis", false, jaulaVisto)

			let huesosVisto = (usr.exec ("getValue",  {id:"huesos"}) != "0")

			lib.GD_CreateMsg ("es","jaula_1", "Dentro puedes ver unos %l1 ")
			lib.GD_CreateMsg ("es","jaula_1_bis", "Dentro puedes ver unos pequeños huesitos, ")
			let msg_jaula_1 = lib.CA_ShowMsg ("jaula_1", {l1: {id: "jaula_1", txt: "pequeños huesitos."}}, jaulaVisto & !huesosVisto)
			let msg_jaula_1_bis = lib.CA_ShowMsg ("jaula_1_bis", undefined, jaulaVisto & huesosVisto)

			lib.GD_CreateMsg ("es","huesos_1", "como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes %l1, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.<br/>");
			lib.GD_CreateMsg ("es","huesos_1_bis", "como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes sacarle una foto a la jaula y volverte a casa, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.");
			let msg_huesos_1 = lib.CA_ShowMsg ("huesos_1", {l1: {id: "huesos_1", txt: "sacarle una foto a la jaula y volverte a casa"}}, jaulaVisto & huesosVisto)
			let msg_huesos_1_bis = lib.CA_ShowMsg ("huesos_1_bis", undefined, jaulaVisto & !huesosVisto)

			lib.GD_DefAllLinks ([
				{ id: msg_chimenea_1, changeTo: msg_chimenea_1_bis, visibleToTrue: [msg_jaula_1], libCode: {functionId:'setValue', par: {id:"jaula", value:"1"}} },
				{ id: msg_jaula_1, changeTo: msg_jaula_1_bis, visibleToTrue: [msg_huesos_1] , libCode: {functionId:'setValue', par: {id:"huesos", value:"1"}} },
				{ id: msg_huesos_1, changeTo: msg_huesos_1_bis, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"} }
			])
		}

	});

	items.push ({
		id: 'nevera',

		desc: function () {

			let item1 = lib.IT_X("nevera")
			if (lib.IT_GetAttPropValue (item1, "generalState", "state") == "0") {
				lib.GD_CreateMsg ("es","desc_nevera", "La abres con repuganancia y descubres con sorpresa que está fría. Tiene una lucecita encendida en el interior, a pesar de que el cable que sale de la nevera cuelga, pelado, sin conectar a ningún enchufe.")
				lib.CA_ShowMsg ("desc_nevera")
				lib.IT_SetAttPropValue (item1, "generalState", "state", "1");
				// que no pasen a estar en la nevera hasta que se describa la primera vez
				lib.IT_SetLoc(lib.IT_X("botella"), item1);
				lib.IT_SetLoc(lib.IT_X("taper"), item1);
				lib.IT_SetLoc(lib.IT_X("dinamita"), item1);
				lib.IT_SetLoc(lib.IT_X("queso"), item1);
			} else {
				lib.GD_CreateMsg ("es","desc_nevera_2", "La vuelves a abrir, fascinado por su repugnancia.")
				lib.CA_ShowMsg ("desc_nevera_2")
			}

			let botellaHay = (lib.IT_GetLoc(lib.IT_X("botella")) == item1)
			let taperHay = (lib.IT_GetLoc(lib.IT_X("taper")) == item1)
			let dinamitaHay = (lib.IT_GetLoc(lib.IT_X("dinamita")) == item1)
			let quesoHay = (lib.IT_GetLoc(lib.IT_X("queso")) == item1)
			let mostrarContenido = (botellaHay || taperHay || dinamitaHay || quesoHay)
			let botellaVisto = (lib.IT_GetAttPropValue (lib.IT_X("botella"), "generalState", "state") == "1")
			let taperVisto = (lib.IT_GetAttPropValue (lib.IT_X("taper"), "generalState", "state") != "0")
			let dinamitaVisto = (lib.IT_GetAttPropValue (lib.IT_X("dinamita"), "generalState", "state") == "1")
			let quesoVisto = (lib.IT_GetAttPropValue (lib.IT_X("queso"), "generalState", "state") == "1")

			lib.GD_CreateMsg ("es", "dentro_de_nevera", "Dentro de la nevera hay:<br/>");
			lib.CA_ShowMsg ("dentro_de_nevera", undefined, mostrarContenido)

			lib.GD_CreateMsg ("es","desc_botella_1", "- %l1<br/>");
			let msg_desc_botella_1 = lib.CA_ShowMsg ("desc_botella_1",  {l1: {id: "desc_botella_1", txt: "una botella"}} , botellaHay && !botellaVisto)
			lib.GD_CreateMsg ("es","desc_botella_1_bis", "- una botella con un líquido rojo que no parece vino.<br/>");
			let msg_desc_botella_1_bis = lib.CA_ShowMsg ("desc_botella_1_bis", undefined , botellaHay && botellaVisto)

			lib.GD_CreateMsg ("es","desc_taper_1", "- %l1<br/>");
			let msg_desc_taper_1 = lib.CA_ShowMsg ("desc_taper_1",  {l1: {id: "desc_taper_1", txt: "un táper"}} , taperHay && !taperVisto)
			lib.GD_CreateMsg ("es","desc_taper_1_bis", "- un  táper con cosas moviéndose dentro.<br/>");
			let msg_desc_taper_1_bis = lib.CA_ShowMsg ("desc_taper_1_bis", undefined , taperHay && taperVisto)

			lib.GD_CreateMsg ("es","desc_dinamita_1", "- %l1<br/>");
			let msg_desc_dinamita_1 = lib.CA_ShowMsg ("desc_dinamita_1",  {l1: {id: "desc_dinamita_1", txt: "una barra de dinamita"}} , dinamitaHay && !dinamitaVisto)
			lib.GD_CreateMsg ("es","desc_dinamita_1_bis", "- una barra de dinamita, ¿en serio?<br/>");
			let msg_desc_dinamita_1_bis = lib.CA_ShowMsg ("desc_dinamita_1_bis", undefined , dinamitaHay && dinamitaVisto)

			lib.GD_CreateMsg ("es","desc_queso_1", "- %l1<br/>");
			let msg_desc_queso_1 = lib.CA_ShowMsg ("desc_queso_1",  {l1: {id: "desc_queso_1", txt: "queso"}} , quesoHay && !quesoVisto)
			lib.GD_CreateMsg ("es","desc_queso_1_bis", "- queso maloliente<br/>");
			let msg_desc_queso_1_bis = lib.CA_ShowMsg ("desc_queso_1_bis", undefined , quesoHay && quesoVisto)

			lib.GD_CreateMsg ("es","desc_nevera_3", "Pero ya no queda nada de su contenido original.<br/>");
			lib.CA_ShowMsg ("desc_nevera_3", undefined, !mostrarContenido)

			lib.GD_DefAllLinks ([
				{ id: msg_desc_botella_1, changeTo: msg_desc_botella_1_bis,
					libCode: {functionId: "setValue", par: {id:"botella", value:"1"}}
				},
				{ id: msg_desc_taper_1, changeTo: msg_desc_taper_1_bis,
					libCode: {functionId: "setValue", par: {id:"taper", value:"1"}}
				},
				{ id: msg_desc_dinamita_1, changeTo: msg_desc_dinamita_1_bis,
					libCode: {functionId: "setValue", par: {id:"dinamita", value:"1"}}
				},
				{ id: msg_desc_queso_1, changeTo: msg_desc_queso_1_bis,
					libCode: {functionId: "setValue", par: {id:"queso", value:"1"}}
				}
			])

		}

	});

	items.push ({
		id: 'espejo',


		desc: function () {
			usr.exec ("escena_espejo")
		}

	});

	items.push ({
		id: 'póster',


		desc: function () {

			let posterVisto = (usr.exec ("getValue", {id:"póster"}) != 0)

			lib.GD_CreateMsg ("es","póster_1", "Ves las ropas y poses típicas de un grupo de rock gótico llamado Los Ultratumba y una estrofa de una cancion del grupo.");
			lib.GD_CreateMsg ("es","póster_2", "La canción reza así:");
			lib.GD_CreateMsg ("es","póster_3", "Dame tu sangre<br/>Si quieres entrar<br/>Dame su sangre<br/>Al mundo infernal.<br/>");

			lib.CA_ShowMsg ("póster_1" )
			lib.CA_ShowMsg ("póster_2" )
			if (!posterVisto) {lib.CA_PressKey ("tecla");}
			lib.CA_ShowMsg ("póster_3" )
			usr.exec ("setValue",  {id:"póster", value:"1"})

		}
	});

	items.push ({
		id: 'gato',

		desc: function () {

			lib.GD_CreateMsg ("es","gato_1", "El gato, ¿o será gata?, parece tener pintada una cresta punky y los ojos maquillados. No te presta la menor atención, ocupado observando el agujero al otro lado de la habitación.");
			lib.CA_ShowMsg ("gato_1" )
			usr.exec ("setValue", {id:"gato"}, "1")
		}
	});


		items.push ({
			id: 'ratón',

			desc: function () {

				lib.GD_CreateMsg ("es","ratón_1", "Además de ver su húmedo hocico y sus bigotes moverse entre las sombas, en algún momento se gira y ves por su tamaño que no le falta basura que comer en esta casa.");
				lib.CA_ShowMsg ("ratón_1" )
				usr.exec ("setValue", {id:"ratón"}, "1")

			}
		});

		items.push ({
			id: 'cuadro2',

			desc: function () {

				lib.GD_CreateMsg ("es","cuatro2_1", "Es un retato nupcial en el que se observa al Abuelo Rarito de joven, acompañado de su mujer. El cuadro está en perfecto estado, sin una rozadura.");
				lib.CA_ShowMsg ("cuatro2_1" )
			}
		});

		items.push ({
			id: 'ataúd',

			desc: function () {

				lib.GD_CreateMsg ("es","ataúd_1", "Te lo quedas mirando largos minutos. Sabes que no puedes salir y que todo te lleva a meterte en esa caja mortuoria de mármol.");
				lib.GD_CreateMsg ("es","ataúd_2", "Entras y tanteas el interior. La tapa tiene unas agarraderas que permiten desplazarla y quedarte encerrado, como así haces.");
				lib.GD_CreateMsg ("es","ataúd_3", "Tierra cayendo sobre tu ataúd, gritos de '¡Monstruo!', ¡ahí te pudras toda la eternidad!<br/>La sangre de la doncella estuvo deliciosa y esos cafres no te clavaron ninguna estaca. Sólo será una siestita de unos años, y volverás a la superficie, en uno de tus saltos temporales al futuro.");
				lib.GD_CreateMsg ("es","ataúd_4", "Ya no estás en el ataúd sino de vuelta en el hall de la mansión.")

				lib.CA_ShowMsg ("ataúd_1" )
				lib.GD_CreateMsg ("es","tecla-ataúd-1", "Entra en el ataúd")
				lib.CA_PressKey ("tecla-ataúd-1");
				lib.CA_ShowMsg ("ataúd_2" )
				lib.CA_PressKey ("tecla");
				lib.CA_ShowMsg ("ataúd_3" )
				lib.GD_CreateMsg ("es","tecla-ataúd-2", "Vuelves al presente")
				lib.CA_PressKey ("tecla-ataúd-2");
				lib.CA_ShowMsg ("ataúd_4" )

				usr.exec ("setValue", {id:"ataúd"}, "1")
				lib.PC_SetCurrentLoc(lib.IT_X("hall"))

			}
		});

}

function initReactions (lib, usr) {

	// acciones de lib deshabilitadas
	reactions.push ({ id: 'jump', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'sing', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'wait', enabled: function (indexItem, indexItem2) {		return false		}	});


	reactions.push ({
		id: 'look',

		enabled: function (indexItem, indexItem2) {
			if (lib.PC_GetCurrentLoc() == lib.IT_X("intro1")) { return false }
			if (lib.PC_GetCurrentLoc() == lib.IT_X("intro2")) { return false }
		},

		reaction: function (par_c) {

			/*if (par_c.loc == lib.IT_X("intro1")) {
				return true // not to redescribe
			}
			*/

		}

	}); // look

	reactions.push ({
		id: 'go',

		reaction: function (par_c) {

			if (par_c.target == lib.IT_X("intro2")) {

				lib.GD_CreateMsg ("es", "intro2", "a intro2<br/>");
				lib.CA_ShowMsg ("intro2")
				return false; // just a transition

			}

 			if ((par_c.loc == lib.IT_X("hall")) && (par_c.target == lib.IT_X("porche")))  {
				lib.GD_CreateMsg ("es", "al porche_1", "Huyes de la casa antes de tiempo, deshonra ante tus amigos<br/>La partida termina, pero seguro que puedes hacerlo mejor la próxima vez.<br/>");
				lib.CA_ShowMsg ("al porche_1")
				lib.CA_PressKey ("tecla");
				lib.GD_CreateMsg ("es", "al porche_2", "Ahora, entre tú y yo, jugador, hagamos como que nunca has intentado salir, y continua la partida como si nada.<br/>");
				lib.CA_ShowMsg ("al porche_2")
				//lib.CA_EndGame("al porche_1")
				return true

			}

			if ((par_c.loc == lib.IT_X("porche")) && (par_c.target == lib.IT_X("hall")))  {

				if (!lib.IT_IsCarried(lib.IT_X("móvil"))) {
					lib.GD_CreateMsg ("es", "entrar_sin_móvil", "El reto consiste en salir con una foto, ¿cómo vas a conseguirla si dejas la cámara fuera?<br/>");
					lib.CA_ShowMsg ("entrar_sin_móvil")
					return true
				}

				//antes de intentar abrir esa majestuosa puerta. Apoyas la mano, seguro de que no abrirá y...
				// ?: "Al tocar el pomo la puerta lanzó un horripilante grito de bienvenida. El intruso dio un salto y casi se dio la vuelta, pero se sobrepuso y acabó de abrir la puerta. Sólo veía un poco alrededor, de la luz de la calle. Al encender la linterna vio que estaba ante un inmenso hall que con su exigua luz no podía apreciar de manera clara, como si en las sombras que quedaban fuera de su haz se movieran figuras amenazantes.<br/>");

				lib.GD_CreateMsg ("es", "ruido_puerta", "Un pequeño empujón y el sonido lastimoso de la puerta al abrirse te suena como la madre del sonido de todas las puertas de las películas de terror de nunca jamás, como si esos presuntuosos ruidos no fueran más que una reproducción de mala calidad de lo que acabas de escuchar.");
				lib.CA_ShowMsg ("ruido_puerta")
				lib.CA_PressKey ("tecla");
				return false

			}

			if ((par_c.loc == lib.IT_X("pasillo")) && (par_c.target == lib.IT_X("hab-hijos")))  {
				if (lib.IT_GetLoc(lib.IT_X("ratón")) == lib.IT_X("limbo")) {
					lib.GD_CreateMsg ("es", "hab_hijos_sellada", "De alguna manera, ya sabes que no hay nada más que hacer en esta habitación.\n")
					lib.CA_ShowMsg ("hab_hijos_sellada")
					return true
				}
			}

			if ((par_c.loc == lib.IT_X("pasillo")) && (par_c.target == lib.IT_X("hab-padres")))  {
				if (usr.exec ("getValue", {id:"espejo"}) == "1") {
					lib.GD_CreateMsg ("es", "hab_padres_sellada", "Ni por lo más sagrado volverás a entrar en esa habitación y su horrendo espejo.\n")
					lib.CA_ShowMsg ("hab_padres_sellada")
					return true
				}
			}

			if (par_c.loc == lib.IT_X("hab-padres"))  {
				if (lib.IT_GetAttPropValue (lib.IT_X("espejo"), "generalState", "state") == "0") {
					lib.GD_CreateMsg ("es", "mirar_espejo", "Cuando vas a salir, no puedes evitar dejar de observar el espejo.\n")
					lib.CA_ShowMsg ("mirar_espejo")
					usr.exec ("escena_espejo")
					return false
				}
		  }

			if ((par_c.loc == lib.IT_X("pasillo")) && (par_c.target == lib.IT_X("hab-abuelos")))  {
				if (usr.exec ("getValue", {id:"ataúd"}) == "1") {
					lib.GD_CreateMsg ("es", "entrar_hab_abuelos_ya", "Los que quiera que te dejaron entrar una vez, no parecen querer que sigas merodeando por su casa.<br/>")
					lib.CA_ShowMsg ("entrar_hab_abuelos_ya")
					return true
				} else if (lib.IT_GetLoc(lib.IT_X("botella-vacía")) == lib.IT_X("limbo")) {
					lib.GD_CreateMsg ("es", "entrar_hab_abuelos_no", "La puerta no tiene pomo. Está tremendamente fría y es como un mármol negro y oscuro que no refleja la luz. Empujas la puerta, pero eres incapaz de abrirla.<br/>")
					lib.CA_ShowMsg ("entrar_hab_abuelos_no")
					return true
				} else {
					lib.GD_CreateMsg ("es", "entrar_hab_abuelos_sí", "Apoyas tus manos cubiertas de sangre en la fría puerta de mármol negro y notas cómo se abre sin hacer ningún ruido. Al entrar descubres que se cierra detrás tuya con igual discreción.<br/>")
					lib.CA_ShowMsg ("entrar_hab_abuelos_sí")
					return false
				}
			}

			if ((par_c.loc == lib.IT_X("hab-abuelos")))  {
				lib.GD_CreateMsg ("es", "salir_hab_abuelos_no", "No encuentras la manera de abrir la fría puerta de mármol.<br/>")
				lib.CA_ShowMsg ("salir_hab_abuelos_no")
				return true
			}

		}

	}); // go

	reactions.push ({
		id: 'goto',

		/*enabled: function (indexItem, indexItem2) {
			alert ("debug goto.enabled: " + indexItem)
			return true
		},
		*/

		reaction: function (par_c) {

			if ((par_c.loc == lib.IT_X("intro2")) && (par_c.item1Id == "porche"))  {
				lib.GD_CreateMsg ("es", "de_intro_a_porche", "Trastabillas y te caes, te arañas con los arbustos, y casi pierdes el móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
				lib.CA_ShowMsg ("de_intro_a_porche")
				lib.GD_CreateMsg ("es","mira","mira")
				lib.CA_PressKey ("mira");
				return false
			}

		}

	}); // go-to

	reactions.push ({

		id: 'sacar_foto',

		enabled: function (indexItem, indexItem2) {

			if (indexItem != lib.IT_X("móvil")) return false;
			return true;
		},

		reaction: function (par_c) {
			// si en hall y ya has visto los huesos => significa que te vas a tu casa
			if ((par_c.loc == lib.IT_X("hall")) && (usr.exec ("getValue", {id:"huesos"}) == "1") )  {
				usr.exec ("setValue", {id:"huesos", value:"2"})
				lib.GD_CreateMsg ("es", "te_vas_si_pero_no_1", "Sacas las fotos a esos míseros huesos y te diriges a la puerta.<br/>");
				lib.GD_CreateMsg ("es", "te_vas_si_pero_no_2", "Pero cuando vas a girar el pomo de la puerta oyes las risas de desprecio de tus amigos y con rabia das la vuelta. ¡Los vas a dejar muditos!<br/>");

				lib.CA_ShowMsg ("te_vas_si_pero_no_1");
				lib.CA_PressKey ("tecla");
				lib.CA_ShowMsg ("te_vas_si_pero_no_2");

				return true;
			}

			if ((par_c.loc == lib.IT_X("cocina")) && (lib.IT_GetLocId(lib.IT_X("botella") ) == "limbo") && (usr.exec ("getValue", {id:"botella"}) != "2"))  {
				usr.exec ("setValue", {id:"botella", value:"2"})
				lib.GD_CreateMsg ("es", "selfie_de_sangre", "Te sacas un selfie, pero cuando ves a esa cara demacrada cuberta de sangre, lo borras para no dejar rastro de tu vergüenza.<br/>");

				lib.CA_ShowMsg ("selfie_de_sangre");

				return true;

			}


			lib.GD_CreateMsg ("es", "sacas_foto", "Sacas una foto sin ton ni son.<br/>");
			lib.CA_ShowMsg ("sacas_foto");


			return true;
		}


	});

	reactions.push ({

		id: 'drop',

		reaction: function (par_c) {

			if (par_c.item1Id == "móvil") {
				lib.GD_CreateMsg ("es","dejar_móvil", "Aunque ilumina poco, sin él no verías casi nada en la casa. Además, ¿cómo sacarás la foto que necesitas sin él? Lo dejas estar.<br/>")
				lib.CA_ShowMsg ("dejar_móvil")
				return true
			}

		if (par_c.item1Id == "queso") {
			if (lib.PC_GetCurrentLocId() == "hab-hijos") {
				// escena pelea ratón y gato
				lib.GD_CreateMsg ("es","dar_queso_1", "Al dejarle en el suelo el queso al ratón, el ratón sale tímidamente de su agujero, y el gato se abalanza sobre él.")
				lib.GD_CreateMsg ("es","dar_queso_2", "El gato le propina un par de zarpazos, pero el ratón lo mira con unos llameantes ojos rojos que hacen arder la cola del gato, por lo que sale corriendo de la habitación mientras el ratón se va con el queso a su agujero, triunfante esta vez.<br/>")

				lib.CA_ShowMsg ("dar_queso_1")
				lib.CA_PressKey ("tecla");
				lib.CA_ShowMsg ("dar_queso_2")
				lib.IT_SetLocToLimbo(par_c.item1)
				lib.IT_SetLocToLimbo(lib.IT_X("ratón"))
				lib.IT_SetLocToLimbo(lib.IT_X("gato"))
				usr.exec ("setValue", {id:"ratón", value:"1"})
				usr.exec ("setValue", {id:"gato", value:"1"})
				return true
			}
		}
		return false
	}

	});

	reactions.push ({

		id: 'listen',

		enabled: function (indexItem, indexItem2) {

			if (indexItem != lib.IT_X("chimenea")) return false;
			return true;
		},


		reaction: function (par_c) {

			let escena = usr.exec ("escenas_pendientes")
			lib.GD_CreateMsg ("es","escuchas_1", "Una voz lejana y amable te susurra:<br/>")
			lib.CA_ShowMsg ("escuchas_1")
			lib.CA_ShowMsgAsIs (escena)

			if (escena == "done") {
				usr.exec ("escenaFinal")
			}

			return true
		}

	});

	reactions.push ({

		id: 'take_from',

		reaction: function (par_c) {
			// si es la dinamita, escena de la guerra
			if ((par_c.item1Id == "dinamita") || (par_c.item1Id == "botella")) {
				if (par_c.item1Id == "dinamita") {
					lib.GD_CreateMsg ("es","coger_dinamita", "Al coger la dinamita todo se vuelve oscuro.")
					lib.CA_ShowMsg ("coger_dinamita")
				} else {
					lib.GD_CreateMsg ("es","coger_botella", "Nunca has bebido alcohol en tu vida, pero esta casa te está dando tanto miedo que crees que echarte un trago te hará sacudírtelo de encima. Pero nada más abrirlo te das cuenta de que eso no es vino, sino... los efluvios que salen de la botella te transportan a otro mundo.")
					lib.CA_ShowMsg ("coger_botella")
				}
				lib.CA_PressKey ("tecla");

				lib.GD_CreateMsg ("es","coger_dinamita_11", "Estás en mitad de un combate de principios de siglo 20, en las trincheras. Un enemigo a caballo salta hacia ti. Coges la dinamita, se la arrojas. Caballo y jinete saltan por los aires en pedazos, y sobre ti caen jirones de carne y mucha sangre.<br/>")
				lib.GD_CreateMsg ("es","coger_dinamita_12", "Te estás muriendo desangrado, pero llega una especie de ratón volador, un murciélago que se posa en tu pecho y te mira con mirada inquisidora.<br/>")
				lib.GD_CreateMsg ("es","coger_dinamita_13", "Sin saber muy bien por qué, con tu último álito vital, asientas, ladeas la cabeza y dejas que el bicho te muerda en el cuello.<br/>")
				lib.CA_ShowMsg ("coger_dinamita_11")
				lib.CA_ShowMsg ("coger_dinamita_12")
				lib.CA_ShowMsg ("coger_dinamita_13")
				lib.CA_PressKey ("tecla");

				lib.GD_CreateMsg ("es","coger_dinamita_21", 	"Al recuperar la consciencia, ya no tienes la dinamita en la mano, pero sí la botella, ahora vacía, de la nevera. Estás cubierto de sangre de cabeza a los pie , rodeado de un charco alrededor.<br/>");
				lib.GD_CreateMsg ("es","coger_dinamita_22", 	"Al volver en sí, te tocas el cuello, pero no tienes nada.<br/>");
				lib.CA_ShowMsg ("coger_dinamita_21")
				lib.CA_ShowMsg ("coger_dinamita_22")

				lib.GD_CreateMsg ("es","coger_dinamita_3", "¿No has tenido suficiente? %l1<br/>");
				let msg_coger_dinamita_3 = lib.CA_ShowMsg ("coger_dinamita_3", {l1: {id: "coger_dinamita_3", txt: "¡Sácate un selfie y sale de esta casa diabólica por dios!"}} )
				//  (selfie -> la foto saldrá sin sangre)


				lib.GD_DefAllLinks ([
					{ id:msg_coger_dinamita_3, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"}}
				])

				lib.IT_SetLocToLimbo (lib.IT_X("dinamita"))
				lib.IT_SetLocToLimbo (lib.IT_X("botella"))
				lib.IT_SetLoc (lib.IT_X("botella-vacía"), lib.PC_GetCurrentLoc())

				return true;
			}

			if (par_c.item1Id == "taper") {
				lib.GD_CreateMsg ("es","coger_taper_1", "Al coger el táper lo miras con atención. Notas el movimiento en su interior, pero no puedes evitar abrirlo. Ves que lo que se mueve son gusanos, alimentándose de un pútrido trozo de carne. A pesar del asco, sientes fascinación hipnótica por toda esa maraña en movimiento y te descubres sin creértelo cogiendo un puñado y metiéndotelo en la boca.<br/>")
				lib.GD_CreateMsg ("es","coger_taper_2", "Se estable una especie de diálogo entre esas hediondas criaturas y tú, que termina con el masticado de las mismas seguida de una visión en primera persona de la siguiente escena imposible:<br/>")
				lib.GD_CreateMsg ("es","coger_taper_3", "Noche de brujas. Hoguera y luna llena. Estás encerrada (eres mujer) en una jaula transportada por personas de ambos sexo desnudas y con máscaras de animales. Gritas a medida que se acercan al fuego. Cada vez más calor. Dolor. Depositan la jaula dentro del fuego. Dolor imposible.<br/>")
				lib.GD_CreateMsg ("es","coger_taper_4", "Sales del trance. El táper está en el suelo, rodeado del vómito que has debido de haber tenido, con algunos gusanos merodeando aún por ahí, pero estás tan avergonzado de lo que acaba de pasar que anulas el táper de tu visión, como si no existiera.<br/>")

				lib.CA_ShowMsg ("coger_taper_1")
				lib.CA_PressKey ("tecla");
				lib.CA_ShowMsg ("coger_taper_2")
				lib.CA_PressKey ("tecla");
				lib.CA_ShowMsg ("coger_taper_3")
				lib.CA_PressKey ("tecla");
				lib.CA_ShowMsg ("coger_taper_4")
				lib.CA_PressKey ("tecla");

				lib.IT_SetLocToLimbo (par_c.item1)
				usr.exec ("setValue", {id:"taper", value:"2"})
				return true;
			}

			if (par_c.item1Id == "queso") {

				if (usr.exec ("getValue", {id:"ratón"}) == "0") {
					lib.GD_CreateMsg ("es","coger_queso_no", "Más de cerca, ves que el queso maloliente está cubierto de una capa grasienta de moho multicolor, lo tocas pero te da tanto asco que no lo coges.<br/>")
					lib.CA_ShowMsg ("coger_queso_no")
					return true
				} else {
					lib.GD_CreateMsg ("es","coger_queso_sí", "Es asqueroso, pero quizás... en la habitación de la litera...<br/>")
					lib.CA_ShowMsg ("coger_queso_sí")
					return false

				}

			}


			return false

		}


	});


}


function initAttributes (lib, usr) {

}

function initUserFunctions (lib, usr) {

	userFunctions.push ({
		id: 'goto',
		code: function (par) { // par.target
			  console.log ("usr.goto: " + JSON.stringify (par))

				// transición
			//	if (par.target == "porche") {
					lib.GD_CreateMsg ("es", "de_intro_a_porche", "Casi trastabillas y te caes, te arañas con los arbustos, y casi pierdes del móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
					lib.CA_ShowMsg ("de_intro_a_porche")
					lib.CA_PressKey ("tecla");
			//	}

				let loc = lib.IT_X(par.target)
				// movimiento
				lib.PC_SetCurrentLoc (loc)

				// redescribe
				lib.CA_ShowDesc (loc)
				lib.CA_Refresh()
		}
	});

	userFunctions.push ({
		id: 'setFrame',
		code: function (par) { // par.pnj
				let status = {}

				lib.CA_EnableChoices(true)
			  console.log ("usr.setFrame: " + JSON.stringify (par))
				let familiaActivation = [
					(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "padre") == "0"),
					(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "madre") == "0"),
					(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "hija") == "0"),
					(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "hijo") == "0"),
					(lib.IT_GetAttPropValue (lib.IT_X("cuadro1"), "familiaState", "abuelo") == "0") ]

					let bis_active = !(familiaActivation[0] || familiaActivation[1] || familiaActivation[2] || familiaActivation[3] || familiaActivation[4])

					// si se han visto ya todos, mostrar opciones habituales
					if (bis_active) {
						//lib.CA_EnableChoices(false)
						status.enableChoices = true
				}

				return status
			}
	});

	userFunctions.push ({
		id: 'setValue',
		code: function (par) { // par.id, par.value
		  lib.IT_SetAttPropValue (lib.IT_X(par.id), "generalState", "state", par.value)
		}
	});

	userFunctions.push ({
		id: 'getValue',
		code: function (par) { // par.id
		  return lib.IT_GetAttPropValue (lib.IT_X(par.id), "generalState", "state")
		}
	});

	userFunctions.push ({
		id: 'escena_espejo',
		code: function (par) {
			lib.GD_CreateMsg ("es","desc_espejo_1", "Lo observas absorto... las sombras en la cama parecen cobrar forma, una forma se mueve como, no!, es una serpiente de dos metros de manchas rojas y verdes, que se enrosca alrededor tuyo.")
			lib.GD_CreateMsg ("es","desc_espejo_2", "Oyes un aullido al otro lado de la puerta, que se abre de golpe. La figura imponente de un lobo salta a la cama y te arroja fuera de ella con un zarpazo. La pelea de pasión y sexo que ves desplegarse delante tuya entre dos seres de naturaleza tan dispar, de seguro dejarán huella en tu psique el resto de tu vida. No lo pudes soportar y gritas, pierdes el aliento y caes al suelo.")
			lib.GD_CreateMsg ("es","desc_espejo_post_1", "Al despertar descubres que estás fuera de la habitación, que está ahora cerrada con llave.")

			lib.CA_ShowMsg ("desc_espejo_1")
			lib.CA_PressKey ("tecla");
			lib.CA_ShowMsg ("desc_espejo_2")
			lib.CA_PressKey ("tecla");
			lib.CA_ShowMsg ("desc_espejo_post_1")
			lib.CA_PressKey ("tecla");

			usr.exec ("setValue", {id:"espejo", value:"1"})
			lib.CA_PressKey ("tecla");
			lib.PC_SetCurrentLoc(lib.IT_X("pasillo"))
		}

	});

	userFunctions.push ({
		id: 'escenas_pendientes',
		code: function (par) {
			let suma = 0
			let escenas = ["sangre", "hambre", "espejo", "ataúd", "cuadro", "huesos", "gusanos"]
			let estado_escena = [false,false,false,false,false,false,false]

			//let lib = lib // tricky

			estado_escena[0] = (lib.IT_GetLoc(lib.IT_X("botella-vacía")) == lib.IT_X("limbo"))
			estado_escena[1] = (lib.IT_GetLoc(lib.IT_X("ratón")) != lib.IT_X("limbo"))
			estado_escena[2] = (usr.exec ("getValue", {id:"espejo"}) == "0")
			estado_escena[3] = (usr.exec ("getValue", {id:"ataúd"}) == "0")
			estado_escena[4] = (usr.exec ("getValue", {id:"cuadro1"}) == "0")
			estado_escena[5] = (usr.exec ("getValue", {id:"huesos"}) == "0")
			estado_escena[6] = (usr.exec ("getValue", {id:"taper"}) != "2")

			let pendientes = 0
			for (let i=0; i<estado_escena.length;i++) if (estado_escena[i]) pendientes++

			console.log("Debug: quedan " + pendientes + " cosas por hacer: " + JSON.stringify (pendientes))

			let elegido = lib.MISC_Random(pendientes)

			for (let i=0, j=0; i<estado_escena.length;i++) {
				if (estado_escena[i]) {
					if (j==elegido) {
						return escenas[i]
					}
					j++;
				}
			}

			return "done"
		}

	});

	userFunctions.push ({
		id: 'escenaFinal',
		code: function (par) {
			lib.GD_CreateMsg ("es","escena_final_1", "Suena el móvil! Los Raritos, ya están de vuelta! No sabes ni donde esconderte y acabas en el hall, debajo de una mesa, justo a tiempo cuando oyes abrir la puerta se abre en silencio dejando pasar las risas de la famila. Un click y la luz se enciende.<br/>")
		  lib.GD_CreateMsg ("es","escena_final_2", "Todo es brillo y pulcritud.")
			lib.GD_CreateMsg ("es","escena_final_3", "El niño sin dejar de comer golosinas sin parar, se te acerca, te lanza un ingenuo bú! y se va entre risas mientras le intenta poner la zancadilla a su hermana, que lo esquiva sin mayor esfuerzo y subes las escaleras a su habitación mientras escucha música de sus casos y sin prestarte la más mínima atención.")
			lib.GD_CreateMsg ("es","escena_final_4", "Los padres te ofrecen la mano y te hacen salir de tu escondite.<br/>")
			lib.GD_CreateMsg ("es","escena_final_5", "El: Parece que has tenido un memorable Halloween! Auuuuuuuuuuuu!<br/>")
			lib.GD_CreateMsg ("es","escena_final_6", "Ella: No te dejezzzzzzz confundir, nada ezzzzzzz lo que parece zer.<br/>")
			lib.GD_CreateMsg ("es","escena_final_7", "El abuelo se acerca a ti y sale contigo al porche, rodeados de plantas hermosas y sanas, echándote un amigable brazo al hombro.<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_1", "Abuelo: Creo que después de esta noche no volverás a entrar en casas ajenas sin persono, ¿verdad?<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_2", "Asientes")
			lib.GD_CreateMsg ("es","escena_abuelo_3", "Abuelo: Tengo esto para ti, pero no lo abras todavía.<br/>" )
			lib.GD_CreateMsg ("es","escena_abuelo_4", "Te entrega un sobre y te coge el móvil.")
			lib.GD_CreateMsg ("es","escena_abuelo_5", "Abuelo: Está claro que este momento hay que retratarlo!<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_6", "Se saca un selfie contigo y entra en la casa, dejándote a solas en el mismo porche de hojas muertas al que saltaste hace ahora un rato.<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_7", "Un sobre y una foto. Truco y trato, lo tienes todo esta noche. Te sientas en el bordillo del porche y los observas con detenimiento:<br/>")

			lib.GD_CreateMsg ("es","sobre", "No puede ser! Dentro está la carta que te salió mientras jugabas con tus amigos, ¿pero qué diablos...?, ¿cómo es que...?<br/>")
			lib.GD_CreateMsg ("es","foto", "Tus desvelos no podían quedar en saco roto: en la foto que sacó el Abuelo sales tú sonriendo, con un murciélago apoyado en tu hombro.<br/>")

			lib.GD_CreateMsg ("es","caray", "Caray, qué noche. Sales de la finca de Los Raritos, caminando entre zombies y brujas.")

			lib.CA_ShowMsg ("escena_final_1" )
			lib.CA_PressKey ("tecla");
			lib.CA_ShowMsg ("escena_final_2" )
			lib.CA_ShowMsg ("escena_final_3" )
			lib.CA_ShowMsg ("escena_final_4" )
			lib.CA_PressKey ("tecla");
			lib.CA_ShowMsg ("escena_final_5" )
			lib.CA_ShowMsg ("escena_final_6" )

			lib.CA_PressKey ("tecla");

			lib.CA_ShowMsg ("escena_final_7" )

			lib.CA_PressKey ("tecla");

			lib.CA_ShowMsg ("escena_abuelo_1" )
			lib.CA_ShowMsg ("escena_abuelo_2" )
			lib.CA_PressKey ("tecla");
			lib.CA_ShowMsg ("escena_abuelo_3" )
			lib.CA_ShowMsg ("escena_abuelo_4" )
			lib.CA_PressKey ("tecla");
			lib.CA_ShowMsg ("escena_abuelo_5" )
			lib.CA_ShowMsg ("escena_abuelo_6" )
			lib.CA_ShowMsg ("escena_abuelo_7" )

		  // to-do: interactivo
			lib.GD_CreateMsg ("es","tecla-sobre", "Ver el contenido del sobre")
			lib.CA_PressKey ("tecla-sobre");
			lib.CA_ShowMsg ("sobre" )
			lib.GD_CreateMsg ("es","tecla-foto", "Ver el selfie con el Abuelo Rarito")
			lib.CA_PressKey ("tecla-foto");
			lib.CA_ShowMsg ("foto" )

			lib.GD_CreateMsg ("es","tecla-caray", "Sales a la calle")
			lib.CA_PressKey ("tecla-caray");

		  lib.CA_EndGame("caray")
			usr.exec ("setValue", {id:"intro2", value:"1"})
		}

	});

}
