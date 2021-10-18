"use strict";
//Section 1a: gameReaction (lib overwrite)

//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: internal functions

// **********************************************
//Section 1: gameReaction
// **********************************************

/*

Se usa un atributo genérico en cada item que lo necesite: primitives.IT_GetAttPropValue (item, "generalState", "state")


"kit de recursos:"
	- Más cuadros
	- Más pisadas
	- Ojos que te miran en la oscuridad
	- queso
	- fotos
	- linterna
	- cuadro escondido con la foto de la abuela rasgada.

Eventos:
	- un perro (o perro-lobo, lobo-perro, o simplemente lobo?) se te planta en mitad del pasillo y te enseña los dientes. Sólo puedes ir abajo.

Variables y condiciones:

[movil.estado = on /off, movil.bateria=100]
jaula examinada
habitación_1.state
habitación_2.state
habitación_3.state
cocina.state
turnos_restantes: para que se apresure a examinar la chimenea si no lo ha hecho después de visitar las habitaciones: recibes la llamada de tus amigos...

Créditos: Escena oculta 1:

— ¿Habéis visto que hay alguien escondido detrás de los arbustos del jardín?
— Sí, creo que es un compañero de clase, un friki de los juegos de rol.
El coche sale del aparcamiento de la casa.
— ¿Habéis visto? No ha esperado a que giremos para entrar como un tiro en la casa.
— Mirad allá, ese grupito de adolescentes en círculo de la esquina que no deja de lanzar miradas, además de a sus móviles, a la casa y al coche, son sus amiguetes. ¿Qué estarán tramando?
— No os preocupéis, familia, ya sabéis que nuestras mascotas no permitirán que pase nada… que no deba pasar… ja, ja, ja…

*/

let reactionList = [];
let primitives, libReactions

let reactions = []
let attributes = []
let items = []

let usr = {}

/* Expose stuff */
// module.exports = exports = {
export default {
	dependsOn:dependsOn,
	processAction:processAction,
	itemMethod:itemMethod,
	actionIsEnabled:actionIsEnabled,
	turn:turn
}

function dependsOn (primitives, libReactions, reactionList) {
	this.primitives = primitives
	this.libReactions = libReactions
	this.reactionList = reactionList

	this.reactions = []

	initReactions(this.reactions, this.primitives)

	this.attributes = []
	initAttributes(this.attributes, this.primitives)

	this.items = []
	initItems(this.items, this.primitives)

	usr.primitives = this.primitives

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

// external interface
function processAction (action) {

	let actionIndex = arrayObjectIndexOf (this.reactions, "id", action.actionId)
	if (actionIndex < 0 ) {
		// this.reactionList.push ({type:"rt_msg", txt: 'Error: missing actionId on gReactions: ' + action.actionId} )
		return undefined
	}

	// to-do: verify again  if action is enabled

	console.log ("game action: " +  JSON.stringify (action))

	if (typeof this.reactions[actionIndex].reaction == 'function') {
		return this.reactions[actionIndex].reaction (action)
	}
}

function itemMethod (itemId, methodName, params) {

	var localIndex = arrayObjectIndexOf(this.items, "id", itemId)

	return this.items[localIndex][methodName](params)

}


// external interface
function actionIsEnabled (actionId, item1, item2) {

	if (actionId == undefined) return undefined

	var reactionIndex = arrayObjectIndexOf(this.reactions, "id", actionId)

	if (this.reactions[reactionIndex] == undefined) return undefined
	if (this.reactions[reactionIndex].enabled == undefined) return undefined

	return this.reactions[reactionIndex].enabled(item1, item2)

}

/*
brainstorming: Transito a lib 0.02 para mejorar la visibilidad del código y hacerlo más compacto.
Ejemplos:
	// lw, ld y lo: ludi world, output and definition

	antes: primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state")
	ahora: lw ("getatt", par_c.loc, "gs.state")

	antes: primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)
	ahora: lw ("setatt", par_c.loc, "gs.state", "0")

	antes: primitives.GD_CreateMsg ("es", "Prueba oculta", "Prueba oculta<br/>")
	ahora: ld ("createmsg", "es", "Prueba oculta", "Prueba oculta<br/>")

	antes: primitives.CA_ShowMsg ("sueño1")
	ahora: lo ("showmsg", "sueño1")

	antes: primitives.CA_PressKey ("pulsa_avanzar")
	ahora: lo ("presskey", "pulsa_avanzar")

*/

// ============================

let initReactions =  function  (reactions, primitives) {

	// acciones de lib deshabilitadas
	reactions.push ({ id: 'jump', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'sing', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'wait', enabled: function (indexItem, indexItem2) {		return false		}	});


	reactions.push ({
		id: 'look',

		enabled: function (indexItem, indexItem2) {
			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("intro1")) { return false }
			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("intro2")) { return false }
		},

		reaction: function (par_c) {

			/*if (par_c.loc == primitives.IT_X("intro1")) {
				return true // not to redescribe
			}
			*/

		}

	}); // look

	reactions.push ({
		id: 'go',

		/*
		enabled: function (d, target) {
			alert ("debug go.enabled: " + target)
			return true
		},
		*/

		reaction: function (par_c) {

			if (par_c.target == primitives.IT_X("intro2")) {

				primitives.GD_CreateMsg ("es", "intro2", "a intro2<br/>");
				primitives.CA_ShowMsg ("intro2")
				return false; // just a transition

			}

 			if ((par_c.loc == primitives.IT_X("hall")) && (par_c.target == primitives.IT_X("porche")))  {
				primitives.GD_CreateMsg ("es", "al porche", "Huyes de la casa antes de tiempo, deshonra ante tus amigos<br/>La partida termina, pero seguro que puedes hacerlo mejor la próxima vez.<br/>");
				primitives.CA_EndGame("al porche")
				return true

			}

			if ((par_c.loc == primitives.IT_X("porche")) && (par_c.target == primitives.IT_X("hall")))  {
				//antes de intentar abrir esa majestuosa puerta. Apoyas la mano, seguro de que no abrirá y...
				primitives.GD_CreateMsg ("es", "ruido_puerta", "Un pequeño empujón y el sonido lastimoso de la puerta al abrirse te suena como la madre del sonido de todas las puertas de las películas de terror de nunca jamás, como si esos presuntuosos ruidos no fueran más que una reproducción de mala calidad de lo que acabas de escuchar.<br/>");
				primitives.CA_ShowMsg ("ruido_puerta")
				primitives.CA_PressKey ("tecla");
				return false

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

			if ((par_c.loc == primitives.IT_X("intro2")) && (par_c.item1Id == "porche"))  {
				primitives.GD_CreateMsg ("es", "de_intro_a_porche", "Casi trastabillas y te caes, te arañas con los arbustos, y casi pierdes del móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
				primitives.CA_ShowMsg ("de_intro_a_porche")
				primitives.CA_PressKey ("tecla");
				return false
			}

		}

	}); // go-to

}

// **********************************************
//Section 2: gameAttribute
// **********************************************

let initAttributes =  function  (attributes, primitives) {

}

// **********************************************
//Section 3: items
/*
available methods for each item:
	desc()
	[precondToGo(dir)] // for "loc" items: to unlock/unlock exits
	turn() // by now, mandatory for "npc" and "pc" items


*/

// **********************************************

let initItems =  function  (items, primitives) {

/*
	items.push ({
		id: 'móvil',

		desc: function () {
			primitives.CA_ShowMsg ("móvil")

		}

	});
*/

items.push ({
	id: 'intro1',

	desc: function () {

		primitives.GD_CreateMsg ("es","tecla","tecla")

		primitives.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Intruso, participante en la %l1.<br/>");
		primitives.GD_CreateMsg ("es","Intro1", "Antes de comenzar el juego, hay algunas %l1 que deberías conocer previamente.<br/>");
		primitives.GD_CreateMsg ("es","Intro2", "Pero si ya las conoces, puedes empezar a %l1 directamente.<br/>");
		primitives.GD_CreateMsg ("es","Intro3", "Disfruta de la partida, aventurero.<br/>");
		primitives.GD_CreateMsg ("es", "Consideración0", "Si ya has jugado anteriormente a juegos desarrollados con el motor de kunludi ya sabrás que la interacción se realiza con las opciones disponibles después del texto de la última reacción.%l1<br/>");
		primitives.GD_CreateMsg ("es", "Consideración1", "En esta versión del motor, se han incorporado enlaces en los textos. Sin embargo, estos enlaces sólo tienen aplicabilidad justo depués de aparecer. Si no seleccionas ningún enlace sino eliges una opción externa, los enlaces quedarán desactivados.%l1<br/>");
		primitives.GD_CreateMsg ("es", "Consideración2", "También se ha incorporado un filtro para los los ítems y acciones disponibles. Si pulsas enter mientras editas un filtro, se ejecutará la primera de las opciones disponibles. Es una forma muy dinámica de interacturar (al menos por web) y te animamos a usarla.%l1<br/>");

		var intro0 = primitives.CA_ShowMsg ("Intro0", {l1: {id: "intro0", txt: "ectocomp 2021"}});
		var intro1 = primitives.CA_ShowMsg ("Intro1", {l1: {id: "intro1", txt: "consideraciones de jugabilidad"}});
		var intro2 = primitives.CA_ShowMsg ("Intro2", {l1: {id: "intro2", txt: "jugar"}});
		var intro3 = primitives.CA_ShowMsg ("Intro3", undefined, false);
		var consi0 = primitives.CA_ShowMsg ("Consideración0", {l1: {id: "consi0", txt: "más"}}, false)
		var consi1 = primitives.CA_ShowMsg ("Consideración1", {l1: {id: "consi1", txt: "más"}}, false)
		var consi2 = primitives.CA_ShowMsg ("Consideración2", {l1: {id: "consi2", txt: "El juego comienza"}}, false)

		primitives.GD_DefAllLinks ([
			{ id:intro0, url: "htmls://ectocomp.com"},
			{ id:intro1, visibleToFalse: [intro1, intro2], visibleToTrue: [consi0]},
			{ id:intro2, visibleToFalse: [intro1, intro2], visibleToTrue: [intro3],
				action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}},
			{ id:consi0, visibleToFalse: [consi0], visibleToTrue: [consi1]},
			{ id:consi1, visibleToFalse: [consi1], visibleToTrue: [consi2]},
			{ id:consi2, visibleToFalse: [consi2], visibleToTrue: [intro3],
				action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}},
				//action: { choiceId: "dir1", d1Id :"fuera", targetId:"fuera-casa"}}
		])

	}

});

items.push ({
	id: 'intro2',

	desc: function () {


		primitives.GD_CreateMsg ("es", "escena_inicial_1", "Es sólo entrar y salir. Localizar el dichoso _trofeo_, sacarle una foto y salir pitando.	<br/>");
		primitives.GD_CreateMsg ("es", "escena_inicial_2", "Sabías que la familia Rarita iba a salir a celebrar la noche de Halloween fuera de casa. Escondido detrás de un arbusto en su ruinoso jardín, los acabas de ver desfilar delante tuyo, con unas pintas que por una vez al año no desentona con la del resto.<br/>")
		primitives.GD_CreateMsg ("es", "escena_inicial_3", "¿Cómo has podido dejarte enredar en esto?<br/>");

		primitives.CA_ShowMsg ("escena_inicial_1")
		primitives.CA_ShowMsg ("escena_inicial_2")
		primitives.CA_ShowMsg ("escena_inicial_3")

		primitives.CA_PressKey ("tecla");

		primitives.GD_CreateMsg ("es", "flashback_1", "flashback.Ayer noche. Reunión semanal de colegas de rol-o-lo-que-surja<br/><br/>");
		primitives.GD_CreateMsg ("es", "flashback_21", "Bela: Venga, tira tu carta ya, nos aburrimos! No seas gallina, no creo que e vaya a salir desafío.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_22", "Lanzas las cartas y...<br/>")
		primitives.GD_CreateMsg ("es", "flashback_23", "Tú: ¿¡Qué...!? La muy de Bela, gafe no, gafona, pájaro de mal agüero.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_24", "Todos: No jodas! Ya era hora de que te tocara! Somos ricos!<br/>")
		primitives.GD_CreateMsg ("es", "flashback_25", "Tú: Un momento. Aún tengo una oportunidad.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_26", "Truda: Tú sueñas. Vamos equipo, a deliverar. Tú, por favor, sale de la habitación un momento.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_31", "Por mucho que pegaste el oído a la puerta sólo oíste sus risas.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_32", "Fiulo: Hemos decidido que si quieres retener tu mazo de cartas deberás superar este reto:<br/>")
		primitives.GD_CreateMsg ("es", "flashback_4", "que consiste en...<br/>")
		primitives.GD_CreateMsg ("es", "flashback_5", "entrar en la casa de Los Raritos y salir con una foto de la mascota del Rarito Menor.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_6", "Sales de tu ensimismamiento.<br/>");
		primitives.GD_CreateMsg ("es", "flashback_7", "Ahora que acaban de subirse a su coche fúnebre de cristales oscuros, sabes que ha llegado el momento de entrar. Tu corazón late a mil por hora, los músculos se tensan, así que...<br/>")

		primitives.CA_ShowMsg ("flashback_1")
  	primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("flashback_21")
		primitives.CA_ShowMsg ("flashback_22")
		primitives.CA_ShowMsg ("flashback_23")
		primitives.CA_ShowMsg ("flashback_24")
		primitives.CA_ShowMsg ("flashback_25")
		primitives.CA_ShowMsg ("flashback_26")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("flashback_31")
		primitives.CA_ShowMsg ("flashback_32")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("flashback_4")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("flashback_5")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("flashback_6")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("flashback_7")

		primitives.GD_CreateMsg ("es", "corre", "¡%l!<br/>")
		var msg_corre = primitives.CA_ShowMsg ("corre", {l1: {id: "corre", txt: "CORRE"}})

		primitives.GD_DefAllLinks ([
			{ id: msg_corre, 	action: { choiceId: "action", actionId:"goto", o1Id: "porche"}}
		])

		/*
		primitives.GD_CreateMsg ("es", "DLG_test", "test")
		primitives.CA_QuoteBegin ("Nadie", "DLG_test" , undefined, true ); // error: [    ]
		primitives.CA_ShowMsg ("<br/>")
		*/

	}

});

items.push ({
	id: 'porche',

	desc: function () {

		primitives.GD_CreateMsg ("es","desc-porche", "Las telarañas del sofá colgante son frondosas, pero no decorativas precisamente. Si aquí en el exterior está todo tan mugriento, no quieras ni imaginarte cómo estarán las cosas _dentro_.<br/>");

		//en porche, al encender la linterna: por el rabillo del ojo vez algo deslizarse. Al enfocar con la linterna, vez un surco sobre el descuidado césped que va desde viste el movimiento hasta un agujero debajo de una de las paredes externas de la casa.

		primitives.CA_ShowMsg ("desc-porche")

		primitives.IT_SetLoc(primitives.IT_X("móvil"), primitives.PC_X());

		primitives.GD_CreateMsg ("es","Móvil sólo recibe", "Tus fabulosos amigos al menos te han dejado un %l1, si bien sólo está configurado para sacar fotos y recibir llamadas.<br/>");
		var msg_movil = primitives.CA_ShowMsg ("Móvil sólo recibe", {l1: {id: "enlace-móvil", txt: "móvil"}});
		primitives.GD_DefAllLinks ([{ id:msg_movil, action: { choiceId: "obj1", o1Id: "móvil"}}])

		primitives.GD_CreateMsg ("es","Enciende móvil", "Puedes %l1, pero recuerda que eso gasta baterías!<br/>");
		var msg_movil_2 = primitives.CA_ShowMsg ("Enciende móvil", {l1: {id: "enciende-móvil", txt: "encender el móvil"}});
		primitives.GD_DefAllLinks ([{ id:msg_movil_2, action: { choiceId: "action", actionId:"ex", o1Id: "móvil"}}])

		// demo link
		// primitives.GD_CreateMsg ("es","Mirar", "Puedes %l1, pero no hay mucho que ver!<br/>");
		// var msg_mirar = primitives.CA_ShowMsg ("Mirar", {l1: {id: "mirar", txt: "mirar"}});
		// primitives.GD_DefAllLinks ([{ id:msg_mirar, action: { choiceId: "action0", actionId:"look"}}])

	}

});



	items.push ({
		id: 'hall',

		desc: function () {

			primitives.GD_CreateMsg ("es","desc-hall-1", "Una magnífica escalera con tapete que sería rojo si no fuera por las marcas de **pisadas** lleva a la **planta alta**, y una inmensa **chimenea** domina uno de los laterales del salón.<br/>");
			primitives.GD_CreateMsg ("es","desc-hall-2", "Está todo bastante oscuro pero ves **algunos interruptores**.<br/>");
			// algunos interruptores -> expandir: cubiertos de suciedad, que no parecen funcionar.

			primitives.CA_ShowMsg ("desc-hall-1")
			primitives.CA_ShowMsg ("desc-hall-2")

			// pisadas -> expande: (-> no sólo de personas sino también de animales de distintos tamaños y que no identificas)
			// chimenea-> dentro ves una especie de muñeco vudú semiquemado, y **la jaula del murciélago** está carbonizada.
			// ex jaula -> dentro puedes ver unos huesitos carbonizados y carne chamuzcada.
			// Tú: "No me jodan! Capaz que estos bárbaros se lo han cargado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo voy a poder conseguir mi trofeo?" Puedes **sacarle sacar una foto a la jaula y volverte a casa** o seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.

			// Si enciendes linterna -> ves cuadros de la familia Rarita al completo: **Papá** Rarito, **Mamá** Rarita, **la adolescente** Rarita, **el niño** Rarito y **el abuelo** Rarito.

			// Papá Rarito-> con un lobo a sus pies.
			// Mamá Rarita-> con una serpiente como bufanda
			// La adolescente Rarita ->con un gato
			// Abuelo Rarito -> con el murciélago en el hombro.
			// Niño Rarito -> con un ratón en las manos.

			// evento: oyes unas pisadas adentrándose en la cocina, **¿los sigues?**

			// si (escena final activada) -> escena final, ya sea con final feliz con abuelo o sin escena feliz.
			/*
			escena final:

			Estás rodeado del lobo, el murciélago, el ratón, el gato y sólo falta la serpiente para completar el zoo Rarito.
			En ese momento, suena el teléfono: ¡Los Raritos están llegando, corre!
			Al ir a la puerta, aparece la serpiente que se levanta y te corta el camino.
			Estás atrapado! Cierras los ojos, te haces un ovillo en el suelo y te lo haces encima.
			<tecla>
			Al poco, oyes como un grupo de personas se aproxima cantando y haciéndo bromas de Hallowen. Entonces se abre la puerta, casi de manera imperceptible, y oyes el clic de un interruptor. Se enciende una luz respandeciente, que se cuela entre tus dedos.
			Levantas la cabeza, te tapas torpemente la entrepierna del pantalón mojada de orín y los ves. La Familia Rarita al completo, que te observa con atención.
			Niño Rarito deja su calabaza llena de chuches y saca un móvil.
			<tecla>
			Flash! Te acaba de sacar una foto?
			La adolescente Rarita sube las escaleras escuchando la música de sus cascos y mirando su móvil, sin prestarte atención.
			El abuelo te sonríe y te hace un gesto para que lo acompañes al exterior. <tecla>
			abuelo:
			Hijo mío, espero que esta noche hayas aprendido la lección de que no se debe entras en casas ajenas.
			Como recuerdo, llévate esta foto de recuerdo -> al verla con tus amigos, sales con un murciélago en tu hombro. Has conseguido el reto y no sólo conservas tu mazo de cartas sino el respeto y devoción de tus amigos.

			*/

		}

	});

	items.push ({
		id: 'cocina',

		desc: function () {

			primitives.GD_CreateMsg ("es","desc-cocina-1", "Hay un lavavajillas pero está lleno de botellas con un líquido rojo que no parece vino.<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-2", "La nevera -> está fría y milagrosamente se enciende la lucecita del interior, pero no sabes cómo funciona ya que el cable que sale de la misma cuelga, pelado, sin conectar a ningún enchufe. Dentro de la nevera hay:<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-3", "- táper con gusanos<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-4", "- cerebro de ... mejor no lo investigas<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-5", "- una barra de dinamita, ¿en serio?<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-6", "- queso maloliente y mohoso<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-7", "coger dinamita -> < Al coger la dinamita todo se vuelve oscuro. Estás en mitad de un combate de principios de siglo 20, en las trincheras. Un enemigo a caballo salta hacia ti. Coges la dinamita, se la arrojas. Caballo y jinete saltan por los aires en pedazos, y sobre ti caen jirones de carne y mucha sangre.<tecla> Al recuperar la consciencia, ya no tienes la dinamita en la mano, pero sí una botella ahora vácía del lavavajillas. Estás cubierto de sangre de cabeza a los pies y rodeado de un charco alrededor.<br/>");
			primitives.GD_CreateMsg ("es","desc-cocina-8", "¿No has tenido suficiente? _¡Sácate un selfie y sale de aquí  por dios!_ (selfie -> la foto saldrá sin sangre)<br/>");

			primitives.CA_ShowMsg ("desc-cocina-1")
			primitives.CA_ShowMsg ("desc-cocina-2")
			primitives.CA_ShowMsg ("desc-cocina-3")
			primitives.CA_ShowMsg ("desc-cocina-4")
			primitives.CA_ShowMsg ("desc-cocina-5")
			primitives.CA_ShowMsg ("desc-cocina-6")
			primitives.CA_ShowMsg ("desc-cocina-7")
			primitives.CA_ShowMsg ("desc-cocina-8")

		}

	});

	items.push ({
		id: 'pasillo',

		desc: function () {

			/*
			Pasillo superior:
				Desc: ? otro cuadro?

			Evento lobo en pasillo superior: te obliga a bajar. Cuándo lo activamos?



			Al tocar el pomo la puerta lanzó un horripilante grito de bienvenida. El intruso dio un salto y casi se dio la vuelta, pero se sobrepuso y acabó de abrir la puerta. Sólo veía un poco alrededor, de la luz de la calle. Al encender la linterna vio que estaba ante un inmenso hall que con su exigua luz no podía apreciar de manera clara, como si en las sombras que quedaban fuera de su haz se movieran figuras amenazantes.

			Al apagar la linterna, un manto de pánico le pareció rodear y volvió a encenderla de manera irracional. Sabía perfectamente por las películas de terror, que había que racionalizar el gasto de baterías, pero se sentía completamente incapaz de apagarla.

			El intruso subió las escaleras. En el parquet rojo, pisadas de personas y animales de varios tamaños. Al llegar al pasillo superior observó un cuadro con los miembros de la familia con animales (links con los miembros de la familia, y no deja continuar con la movilidad hasta que lo examine todo).

			“Anti bajar”:  un rugido y algo parecido a unos ojos se ocultaban entre las sombras en las escaleras y fue incapaz de volver a bajar.


			Al vivir las experiencias en las tres habitaciones (que podrían cambiar de una partida a otra), apareces en el pasillo superior con la única opción de bajar.

			Si bajas y ya has mirado en la chimenea y visto los huesos del vampiro y en la cocina => escena final.

			*/

			primitives.GD_CreateMsg ("es","desc-pasillo", "desc-pasillo<br/>");
			primitives.CA_ShowMsg ("desc-pasillo")

		}

	});

	items.push ({
		id: 'hab-padres',

		desc: function () {

			/*

			Hab. Padres ->
				Desc: Qué desagradable, un crucifijo invertido preside una cama de tres por tres metros, sin hacer y con las sábanas llenas de manchas cuya naturaleza quizás sea mejor no saber. Un gran espejo en el techo habla de la morbosidad de sus habitantes.
			Examinar espejo (o al salir sin mirarlo): No puedes dejar de mirarlo… las sombras en la cama parecen cobrar forma, una forma se mueve como, no!, es una serpiente de dos metros de manchas rojas y verdes, que se enrosca alrededor tuyo y aprieta sin dejarte respirar. Pierdes el aliento y caes al suelo. <tecla> Al despertar el intruso descubre que está fuera de la habitación que está cerrada con llave.

			Estás de nuevo en el pasillo superior. Unos gruñidos suben del nivel inferior y debes apresurarte a entrar en una de las dos habitaciones disponibles: una con un póster de la serie “Crepúsculo” encima, y la otra totalmente negra y lisa, que casi ni refleja la luz de la linterna.

			*/

			primitives.GD_CreateMsg ("es","desc-hab-padres", "desc-hab-padres<br/>");
			primitives.CA_ShowMsg ("desc-hab-padres")

		}

	});

	items.push ({
		id: 'hab-hijos',

		desc: function () {

			/*
			Una litera? No te quieres ni imaginar las peleas por el terrirorio entre los dos hermanos Raritos.
			Al lado de la cama inferior, hay un agujero del tamaño de una pelota de tenis en la base de la pared. Te recuerda a las casas de los ratones de los dibujos animados, como Tom y Jerry.
			En una esquina, dos ojos. De la sombra avanza ligeramente un gato mira casi todo el tiempo hacia el agujero, pero a veces a ti te dirije miradas fulminantes mientras se lame las uñas.

			si das queso -> sale el ratón, coge queso, y se van ambos animales. (problema de integridad: ¿cómo garantizar que llevas el queso?) O dicho de otra forma, ¿qué pasa si no lo coges? Si estás en la habitación sin el queso, en vez de resolverse la situación dando el queso, aparecería un objeto en la habitación que podrías usar ahí mismo: quizás debajo de la alfombra o similar.

			*/

			primitives.GD_CreateMsg ("es","desc-hab-hijos", "desc-hab-hijos<br/>");
			primitives.CA_ShowMsg ("desc-hab-hijos")

		}

	});

	items.push ({
		id: 'hab-abuelos',

		desc: function () {

		/*

		dormitorio_abuelo:

		// Foto del abuelo Rarito y la difunta Rarita, con sendos murciélagos en sus hombros.
		//? en el techo... ¡el murciélago! -> duerme boca abajo. Si sacar foto -> sale volando y no sale nada en la foto.

			La puerta no tiene ni pomo. Los aullidos se acercan y están cada vez más cerca. Golpeas la puerta con fuerza pero no absorbe tus golpes y no devuelve ningún ruido. Cuando ya estás resignado a tu suerte, te giras. Los aullidos alcanzan un nivel de ruido te hacen mearte encima y justo cuando unas fauces ávidas de ti parecen cerrarse sobre ti caes hacia atrás y caes al suelo en vez de contra la puerta. El sonido agresivo de la bestia se transforma en silencio total.<tecla>La habitación del abuelo. Un ataúd flanqueado por dos velas inmensas encendidas. Suelo y paredes de mármol, gélido. Foto de abuelo y  abuela, ambos con murciélagos al hombro. Aparte de _apagar las velas_, sólo puedes hacer una cosa, _abrir el ataúd_ => te sorprende la suavidad con la que se desliza la tapa. Dentro, nada, vacío. En ese momento, el silencio desaparece. Unas zarpas están razgando la puerta y oyes el sonido de la muerte aproximarte a ti. Te da pavor encerrarte en el ataúd pero tienes que elegir entre _susto_ o _muerte_.

		Si muerte => te levantes y echas a andar un poco mareado en mitad de una multitud de sombras que se acaban transformando en zombies y fantasmas. Ves la reacción que desencadenas cuando te observan: entre admiración por llevar el disfraz más horripilante de Halloween y asco ante el olor que desprendes. Al poco tus amigos aparecen de entre la multitud y te recogen antes de que te vuelvas a desmayar. No has superado la prueba y sólo tienes un relato inverosímil que eres incapaz de contar.

		Si susto => estás como en la mente de otra persona. Oyes como cae tierra encima del ataúd y lágrimas de personas que parecen despedirse en tu último viaje. Pero la tapa no cede. Golpeas y golpeas y sólo consigues hacerte daño en las uñas y los nudillos. Gritas pero nadie te oye. El corazón te va a mil por hora y te falta el aire, te desmayas y <tecla> Apareces en mitad del pasillo superior de la casa.

		Si intentas apagar las velas =>  descubres que no desprenden calor y que no se pueden apagar.


		*/

			primitives.GD_CreateMsg ("es","desc-hab-abuelos", "desc-hab-abuelos<br/>");
			primitives.CA_ShowMsg ("desc-hab-abuelos")

		}

	});


}

// GENERIC turn **********************************************************************************************

function turn (indexItem) {

	var  primitives = this.primitives // tricky



}


// internal functions ****************************************************************************************************************
