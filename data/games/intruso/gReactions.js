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

Contadores usados:

porche.generalState.state: ini 0; 1 ya descrito
hab_padres.generalState.state: ini 0; 1 cuando haya observado el espejo
hab_niños.generalState.state: ini 0; 1 cuando haya dado queso al ratónote
hab_abuelo.generalState.state: ini 0; 1 cuando haya entrado en el ataúd
cuadro1.generalState.state: ini 0; 1 cuando lo haya observado
chimenea.generalState.state: ini 0; 1 cuando haya observado la chimenea
dinamita.loc: en limbo significa que ha vivido la escena de la guerra
poster.generalState.state: ini 0; 1 cuando ha leído la canción del póster
botella.generalState.state: ini 0; 1 abierta; 2 cuando te has huntado las manos con la sangre
turno: si alcanza timeout se recibe llamada de los amigos
----

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
	turn:turn,
	executeUserCode:executeUserCode
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

function executeUserCode (functionName, par) {

	if (typeof usr[functionName] == 'function') {
  	return usr[functionName](par)
	}

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

		reaction: function (par_c) {

			if (par_c.target == primitives.IT_X("intro2")) {

				primitives.GD_CreateMsg ("es", "intro2", "a intro2<br/>");
				primitives.CA_ShowMsg ("intro2")
				return false; // just a transition

			}

 			if ((par_c.loc == primitives.IT_X("hall")) && (par_c.target == primitives.IT_X("porche")))  {
				primitives.GD_CreateMsg ("es", "al porche_1", "Huyes de la casa antes de tiempo, deshonra ante tus amigos<br/>La partida termina, pero seguro que puedes hacerlo mejor la próxima vez.<br/>");
				primitives.CA_ShowMsg ("al porche_1")
				primitives.CA_PressKey ("tecla");
				primitives.GD_CreateMsg ("es", "al porche_2", "Ahora, entre tú y yo, jugador, hagamos como que nunca has intentado salir, y continua la partida como si nada.<br/>");
				primitives.CA_ShowMsg ("al porche_2")
				//primitives.CA_EndGame("al porche_1")
				return true

			}

			if ((par_c.loc == primitives.IT_X("porche")) && (par_c.target == primitives.IT_X("hall")))  {

				if (!primitives.IT_IsCarried(primitives.IT_X("móvil"))) {
					primitives.GD_CreateMsg ("es", "entrar_sin_móvil", "El reto consiste en salir con una foto, ¿cómo vas a conseguirla si dejas la cámara fuera?<br/>");
					primitives.CA_ShowMsg ("entrar_sin_móvil")
					return true
				}

				//antes de intentar abrir esa majestuosa puerta. Apoyas la mano, seguro de que no abrirá y...
				// ?: "Al tocar el pomo la puerta lanzó un horripilante grito de bienvenida. El intruso dio un salto y casi se dio la vuelta, pero se sobrepuso y acabó de abrir la puerta. Sólo veía un poco alrededor, de la luz de la calle. Al encender la linterna vio que estaba ante un inmenso hall que con su exigua luz no podía apreciar de manera clara, como si en las sombras que quedaban fuera de su haz se movieran figuras amenazantes.<br/>");

				primitives.GD_CreateMsg ("es", "ruido_puerta", "Un pequeño empujón y el sonido lastimoso de la puerta al abrirse te suena como la madre del sonido de todas las puertas de las películas de terror de nunca jamás, como si esos presuntuosos ruidos no fueran más que una reproducción de mala calidad de lo que acabas de escuchar.");
				primitives.CA_ShowMsg ("ruido_puerta")
				primitives.CA_PressKey ("tecla");
				return false

			}

			if (par_c.loc == primitives.IT_X("hab-padres"))  {
				if (primitives.IT_GetAttPropValue (primitives.IT_X("espejo"), "generalState", "state") == "0") {
					primitives.GD_CreateMsg ("es", "mirar_espejo", "Cuando vas a salir, no puedes evitar dejar de observar el espejo.\n")
					primitives.CA_ShowMsg ("mirar_espejo")
					usr.escena_espejo()
					return false
				}
		  }

			if ((par_c.loc == primitives.IT_X("pasillo")) && (par_c.target == primitives.IT_X("hab-abuelos")))  {
				if (primitives.IT_GetLoc(primitives.IT_X("botella-vacía")) == primitives.IT_X("limbo")) {
					primitives.GD_CreateMsg ("es", "entrar_hab_abuelos_no", "La puerta no tiene pomo. Está tremendamente fría y es como un mármol negro y oscuro que no refleja la luz. Empujas la puerta, pero eres incapaz de abrirla.<br/>")
					primitives.CA_ShowMsg ("entrar_hab_abuelos_no")
					return true
				} else {
					primitives.GD_CreateMsg ("es", "entrar_hab_abuelos_sí", "Apoyas tus manos cubiertas de sangre en la fría puerta de mármol negro y notas cómo se abre sin hacer ningún ruido. Al entrar descubres que se cierra detrás tuya con igual discreción.<br/>")
					primitives.CA_ShowMsg ("entrar_hab_abuelos_sí")
					return false
				}
			}

			if ((par_c.loc == primitives.IT_X("hab-abuelos")))  {
				primitives.GD_CreateMsg ("es", "salir_hab_abuelos_no", "No encuentras la manera de abrir la fría puerta de mármol.<br/>")
				primitives.CA_ShowMsg ("salir_hab_abuelos_no")
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

			if ((par_c.loc == primitives.IT_X("intro2")) && (par_c.item1Id == "porche"))  {
				primitives.GD_CreateMsg ("es", "de_intro_a_porche", "Trastabillas y te caes, te arañas con los arbustos, y casi pierdes el móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
				primitives.CA_ShowMsg ("de_intro_a_porche")
				primitives.GD_CreateMsg ("es","mira","mira")
				primitives.CA_PressKey ("mira");
				return false
			}

		}

	}); // go-to

	reactions.push ({

		id: 'sacar_foto',

		enabled: function (indexItem, indexItem2) {

			if (indexItem != primitives.IT_X("móvil")) return false;
			return true;
		},

		reaction: function (par_c) {
			primitives.GD_CreateMsg ("es", "sacas_foto", "Sacas una foto sin ton ni son.<br/>");
			primitives.CA_ShowMsg ("sacas_foto");

			return true;
		}


	});

	reactions.push ({

		id: 'drop',

		reaction: function (par_c) {

			if (par_c.item1Id == "móvil") {
				primitives.GD_CreateMsg ("es","dejar_móvil", "Aunque ilumina poco, sin él no verías casi nada en la casa. Además, ¿cómo sacarás la foto que necesitas sin él? Lo dejas estar.<br/>")
				primitives.CA_ShowMsg ("dejar_móvil")
			}
			return true
		}

	});


	reactions.push ({

		id: 'take_from',

		reaction: function (par_c) {
			// si es la dinamita, escena de la guerra
			if (par_c.item1Id == "dinamita") {

				primitives.GD_CreateMsg ("es","coger_dinamita_11", "Al coger la dinamita todo se vuelve oscuro. Estás en mitad de un combate de principios de siglo 20, en las trincheras. Un enemigo a caballo salta hacia ti. Coges la dinamita, se la arrojas. Caballo y jinete saltan por los aires en pedazos, y sobre ti caen jirones de carne y mucha sangre.<br/>")
				primitives.GD_CreateMsg ("es","coger_dinamita_12", "Te estás muriendo desangrado, pero llega una especie de ratón volador, un murciélago que se posa en tu pecho y te mira con mirada inquisidora.<br/>")
				primitives.GD_CreateMsg ("es","coger_dinamita_13", "Sin saber muy bien por qué, con tu último álito vital, asientas, ladeas la cabeza y dejas que el bicho te muerda en el cuello.<br/>")
				primitives.CA_ShowMsg ("coger_dinamita_11")
				primitives.CA_ShowMsg ("coger_dinamita_12")
				primitives.CA_ShowMsg ("coger_dinamita_13")
				primitives.CA_PressKey ("tecla");

				primitives.GD_CreateMsg ("es","coger_dinamita_21", 	"Al recuperar la consciencia, ya no tienes la dinamita en la mano, pero sí la botella, ahora vacía, de la nevera. Estás cubierto de sangre de cabeza a los pie , rodeado de un charco alrededor.<br/>");
				primitives.GD_CreateMsg ("es","coger_dinamita_22", 	"Al volver en sí, te tocas el cuello, pero no tienes nada.<br/>");
				primitives.CA_ShowMsg ("coger_dinamita_21")
				primitives.CA_ShowMsg ("coger_dinamita_22")

				primitives.GD_CreateMsg ("es","coger_dinamita_3", "¿No has tenido suficiente? %l1<br/>");
				var msg_coger_dinamita_3 = primitives.CA_ShowMsg ("coger_dinamita_3", {l1: {id: "coger_dinamita_3", txt: "¡Sácate un selfie y sale de esta casa diabólica por dios!"}} )
				//  (selfie -> la foto saldrá sin sangre)


				primitives.GD_DefAllLinks ([
					{ id:msg_coger_dinamita_3, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"}}
				])

				primitives.IT_SetLocToLimbo (par_c.item1)
				primitives.IT_SetLocToLimbo (primitives.IT_X("botella"))
				primitives.IT_SetLoc (primitives.IT_X("botella-vacía"), primitives.PC_GetCurrentLoc())

				return true;
			}

			if (par_c.item1Id == "taper") {
				primitives.GD_CreateMsg ("es","coger_taper_1", "Al coger el táper lo miras con atención. Notas el movimiento en su interior, pero no puedes evitar abrirlo. Ves que lo que se mueve son gusanos, alimentándose de un pútrido trozo de carne. A pesar del asco, sientes fascinación hipnótica por toda esa maraña en movimiento y te descubres sin creértelo cogiendo un puñado y metiéndotelo en la boca.<br/>")
				primitives.GD_CreateMsg ("es","coger_taper_2", "Se estable una especie de diálogo entre esas hediondas criaturas y tú, que termina con el masticado de las mismas seguida de una visión en primera persona de la siguiente escena imposible:<br/>")
				primitives.GD_CreateMsg ("es","coger_taper_3", "Noche de brujas. Hoguera y luna llena. Estás encerrada (eres mujer) en una jaula transportada por personas de ambos sexo desnudas y con máscaras de animales. Gritas a medida que se acercan al fuego. Cada vez más calor. Dolor. Depositan la jaula dentro del fuego. Dolor imposible.<br/>")
				primitives.GD_CreateMsg ("es","coger_taper_4", "Sales del trance. El táper está en el suelo, rodeado del vómito que has debido de haber tenido, con algunos gusanos merodeando aún por ahí, pero estás tan avergonzado de lo que acaba de pasar que anulas el táper de tu visión, como si no existiera.<br/>")

				primitives.CA_ShowMsg ("coger_taper_1")
				primitives.CA_PressKey ("tecla");
				primitives.CA_ShowMsg ("coger_taper_2")
				primitives.CA_PressKey ("tecla");
				primitives.CA_ShowMsg ("coger_taper_3")
				primitives.CA_PressKey ("tecla");
				primitives.CA_ShowMsg ("coger_taper_4")
				primitives.CA_PressKey ("tecla");

				primitives.IT_SetLocToLimbo (par_c.item1)
				return true;
			}

			if (par_c.item1Id == "queso") {

				if (usr.getValue ({id:"ratón"}) == "0") {
					primitives.GD_CreateMsg ("es","coger_queso_no", "Más de cerca, ves que el queso maloliente está cubierto de una capa grasienta de moho multicolor, lo tocas pero te da tanto asco que no lo coges.<br/>")
					primitives.CA_ShowMsg ("coger_queso_no")
					return true
				} else {
					primitives.GD_CreateMsg ("es","coger_queso_sí", "Es asqueroso, pero quizás... en la habitación de la litera...<br/>")
					primitives.CA_ShowMsg ("coger_queso_sí")
					return false

				}

			}

			return false

		}


	});


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

		primitives.CA_EnableChoices(false)

		primitives.GD_CreateMsg ("es","tecla","avanza")

		primitives.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Intruso, participante en la %l1.<br/>");
		primitives.GD_CreateMsg ("es","Intro1", "Antes de comenzar el juego, hay algunas %l1 que deberías conocer previamente.<br/>");
		primitives.GD_CreateMsg ("es","Intro2", "Pero si ya las conoces, puedes empezar a %l1 directamente.<br/>");
		primitives.GD_CreateMsg ("es","Intro3", "Disfruta de la partida.<br/>");
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


		primitives.GD_CreateMsg ("es", "escena_inicial_1", "Es sólo entrar y salir. Localizar el dichoso trofeo, sacarle una foto y salir pitando.<br/>");
		primitives.GD_CreateMsg ("es", "escena_inicial_2", "Sabes que la familia Rarita va a salir a celebrar la noche de Halloween fuera de casa. Escondido detrás de un arbusto en su ruinoso jardín, los acabas de ver desfilar delante tuyo, con unas pintas que por una vez al año no desentona con la del resto.<br/>")
		primitives.GD_CreateMsg ("es", "escena_inicial_3", "¿Cómo has podido dejarte enredar en esto?<br/>");

		primitives.CA_ShowMsg ("escena_inicial_1")
		primitives.CA_ShowMsg ("escena_inicial_2")
		primitives.CA_ShowMsg ("escena_inicial_3")

		primitives.CA_PressKey ("tecla");

		primitives.GD_CreateMsg ("es", "flashback_1", "Flashback. Ayer noche. Reunión semanal de colegas de rol-o-lo-que-surja<br/>");
		primitives.GD_CreateMsg ("es", "flashback_21", "Bela: Venga, tira tu carta ya, ¡que nos aburrimos! No seas gallina, no creo que e vaya a salir desafío.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_22", "Lanzas las cartas y...<br/>")
		primitives.GD_CreateMsg ("es", "flashback_23", "Tú: ¿¡Qué...!? La muy de Bela, gafe no, gafona, pájaro de mal agüero.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_24", "Todos, voces solapadas: No jodas! Bien! Ya era hora de que te tocara! Somos ricos!<br/>")
		primitives.GD_CreateMsg ("es", "flashback_25", "Tú: Un momento. Aún tengo una oportunidad.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_26", "Truda: Tú sueñas. Vamos equipo, a deliverar. Tú, por favor, sale de la habitación un momento.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_31", "Por mucho que pegaste el oído a la puerta sólo oíste sus risas. Luego, cuando volviste a entrar:<br/>")
		primitives.GD_CreateMsg ("es", "flashback_32", "Fiulo: Hemos decidido que si quieres retener tu mazo de cartas deberás superar este reto:<br/>")
		primitives.GD_CreateMsg ("es", "flashback_4", "Tienes que entrar en la casa de Los Raritos y salir con una foto de la mascota del menor de La Familia Rarita.<br/>")
		primitives.GD_CreateMsg ("es", "flashback_5", "Sales de tu ensimismamiento.<br/>");
		primitives.GD_CreateMsg ("es", "flashback_6", "Ahora que acaban de subirse a su coche fúnebre de cristales oscuros, sabes que ha llegado el momento de entrar. Tu corazón late a mil por hora, los músculos se tensan, así que...<br/>")

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

		primitives.GD_CreateMsg ("es", "corre", "¡%l1!<br/>")
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

		primitives.GD_CreateMsg ("es","desc-porche-1", "Las telarañas del sofá colgante son frondosas, pero no decorativas precisamente. Si aquí en el exterior está todo tan mugriento, no quieras ni imaginarte cómo estarán las cosas %l1.<br/>");
		let dentro = primitives.CA_ShowMsg ("desc-porche-1", {l1: {id: "dentro", txt: "dentro"}})

		if (primitives.IT_GetAttPropValue (primitives.IT_X(this.id), "generalState", "state") == "0") {  // primera vez
			primitives.GD_CreateMsg ("es","desc-porche-2", "Armado sólo con el %l1 vintage que te dejaron tus amigos.<br/>");

			let msg_movil = primitives.CA_ShowMsg ("desc-porche-2", {l1: {id: "móvil", txt: "móvil"}})
			primitives.GD_DefAllLinks ([
				{ id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: primitives.IT_X("hall"), targetId: "hall", d1Id:"in", d1: primitives.DIR_GetIndex("in")}},
			  { id:msg_movil, action: { choiceId: "obj1", o1Id: "móvil"}}
			])

			primitives.GD_CreateMsg ("es","desc-porche-3", "Por el rabillo del ojo vez algo deslizarse. Al enfocar  la vista ves un surco sobre el descuidado césped que va desde donde viste el movimiento hasta un agujero debajo de una de las paredes externas de la casa.<br/>");
			primitives.CA_ShowMsg ("desc-porche-3")

			primitives.IT_SetLoc(primitives.IT_X("móvil"), primitives.PC_X());
			primitives.IT_SetAttPropValue (primitives.IT_X(this.id), "generalState", "state", "1")

			primitives.CA_EnableChoices(true)
		} else {
			primitives.GD_DefAllLinks ([
			  { id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: primitives.IT_X("hall"), targetId: "hall", d1Id:"in", d1: primitives.DIR_GetIndex("in")}}
			])
		}

	}

});



	items.push ({
		id: 'hall',

		desc: function () {

			// debug: sólo por si en pruebas empezamos aquí.
			primitives.GD_CreateMsg ("es","tecla","avanza")
			primitives.IT_SetLoc(primitives.IT_X("móvil"), primitives.PC_X());

			primitives.GD_CreateMsg ("es","desc_hall_0", "Dejas detrás de ti la puerta exterior. Sabes que salir representa resignarte a la burla de tus amigos y perder tu fabuloso mazo de cartas.<br/>");
			primitives.CA_ShowMsg ("desc_hall_0");

			primitives.GD_CreateMsg ("es","desc_hall_1", "Una inmensa %l1 domina uno de los laterales del salón. ");
			primitives.GD_CreateMsg ("es","desc_hall_a_cocina", "Por el otro lateral, atravesando el comedor, entrevees una puerta que seguramente %l1.<br/>");

			primitives.GD_CreateMsg ("es","desc_hall_2", "A través de un magnífica escalera con tapete, que sería rojo si no fuera por las marcas de %l1, ");
			primitives.GD_CreateMsg ("es","desc_hall_2_plus", " no sólo de personas sino también de animales de distintos tamaños y que no identificas, ");
			primitives.GD_CreateMsg ("es","desc_hall_3", " podrías %l1.");

			var desc_hall_1 = primitives.CA_ShowMsg ("desc_hall_1", {l1:{id: "desc_hall_1", txt: "chimenea"}})
			var desc_hall_a_cocina = primitives.CA_ShowMsg ("desc_hall_a_cocina", {l1:{id: "desc_hall_a_cocina", txt: "lleva a la cocina"}})
			var desc_hall_2 = primitives.CA_ShowMsg ("desc_hall_2", {l1:{id: "desc_hall_2", txt: "pisadas"}})
			var desc_hall_2_plus = primitives.CA_ShowMsg ("desc_hall_2_plus", undefined, false)
			var desc_hall_3 = primitives.CA_ShowMsg ("desc_hall_3", {l1:{id: "desc_hall_3", txt: "ir a la planta alta"}})


			primitives.GD_CreateMsg ("es","interruptores_1", "Está todo bastante oscuro pero ves %l1 ");
			primitives.GD_CreateMsg ("es","interruptores_2", "que están cubiertos de mugre pegajosa y no funcionan.<br/>");

			var msg_interruptores_1 = primitives.CA_ShowMsg ("interruptores_1", {l1:{id: "interruptores_1", txt: "algunos interruptores."}})
			var msg_interruptores_2 = primitives.CA_ShowMsg ("interruptores_2", undefined, false)

			primitives.GD_DefAllLinks ([
				{ id: desc_hall_1, action: { choiceId: "action", actionId:"ex", o1Id: "chimenea"} } ,
				{ id: desc_hall_a_cocina, action: { choiceId: "dir1", actionId:"go", target: primitives.IT_X("cocina"), targetId: "cocina", d1Id:"d270", d1: primitives.DIR_GetIndex("d270")}},
				{ id: desc_hall_2, visibleToTrue: [desc_hall_2_plus]},
				{ id: msg_interruptores_1, visibleToTrue: [msg_interruptores_2]},
				{id: desc_hall_3, action: { choiceId: "dir1", actionId:"go", target: primitives.IT_X("pasillo"), targetId: "pasillo", d1Id:"up", d1: primitives.DIR_GetIndex("up")}}
			])

			// escena final (final feliz)
			primitives.GD_CreateMsg ("es","escena-final-1", "Estás rodeado del lobo, el murciélago, el ratón, el gato y sólo falta la serpiente para completar el zoo Rarito.<br/>");
			primitives.GD_CreateMsg ("es","escena-final-2", "En ese momento, suena el teléfono: ¡Los Raritos están llegando, corre!<br/>");
			primitives.GD_CreateMsg ("es","escena-final-3", "Al ir a la puerta, aparece la serpiente que se levanta y te corta el camino.<br/>");
			primitives.GD_CreateMsg ("es","escena-final-4", "Estás atrapado! Cierras los ojos, te haces un ovillo en el suelo y te lo haces encima.<br/>");
			//<tecla>
			primitives.GD_CreateMsg ("es","escena-final-5", "Al poco, oyes como un grupo de personas se aproxima cantando y haciéndo bromas de Hallowen. Entonces se abre la puerta, casi de manera imperceptible, y oyes el clic de un interruptor. Se enciende una luz respandeciente, que se cuela entre tus dedos.<br/>");
			primitives.GD_CreateMsg ("es","escena-final-6", "Levantas la cabeza, te tapas torpemente la entrepierna del pantalón mojada de orín y los ves. La Familia Rarita al completo, que te observa con atención.<br/>");
			primitives.GD_CreateMsg ("es","escena-final-7", "Niño Rarito deja su calabaza llena de chuches y saca un móvil.<br/>");
			//<tecla>
			primitives.GD_CreateMsg ("es","escena-final-8", "Flash! Te acaba de sacar una foto?<br/>");
			primitives.GD_CreateMsg ("es","escena-final-9", "La adolescente Rarita sube las escaleras escuchando la música de sus cascos y mirando su móvil, sin prestarte atención.<br/>");
			primitives.GD_CreateMsg ("es","escena-final-10", "El abuelo te sonríe y te hace un gesto para que lo acompañes al exterior.<br/>");
			// <tecla>
			primitives.GD_CreateMsg ("es","escena-final-11", "abuelo:<br/>");
			primitives.GD_CreateMsg ("es","escena-final-12", "Hijo mío, espero que esta noche hayas aprendido la lección de que no se debe entras en casas ajenas.<br/>");
			primitives.GD_CreateMsg ("es","escena-final-13", "Como recuerdo, llévate esta foto de recuerdo -> al verla con tus amigos, sales con un murciélago en tu hombro. Has conseguido el reto y no sólo conservas tu mazo de cartas sino el respeto y devoción de tus amigos.<br/>");
			//primitives.CA_EndGame("escena-final-13")

		}

	});

	items.push ({
		id: 'cocina',

		desc: function () {


			primitives.GD_CreateMsg ("es","desc_cocina", "Es la cocina más nauseabunda que has visto en tu vida. Te da asco tocar nada, pero una curiosidad malsana te tienta a %l1.")
			var desc_cocina =  primitives.CA_ShowMsg ("desc_cocina", {l1:{id: "desc_cocina", txt: "mirar qué habrá dentro de la nevera"}})

			primitives.GD_DefAllLinks ([
				{id: desc_cocina, action: { choiceId: "action", actionId:"ex", o1Id: "nevera"} }
			])


		}

	});

	items.push ({
		id: 'pasillo',

		desc: function () {

			//?: Evento lobo en pasillo superior: te obliga a bajar. Cuándo lo activamos?
			//? Al apagar la linterna, un manto de pánico le pareció rodear y volvió a encenderla de manera irracional.
			// Sabía perfectamente por las películas de terror, que había que racionalizar el gasto de baterías, pero se sentía completamente incapaz de apagarla.
			// transición: El intruso subió las escaleras. En el parquet rojo, pisadas de personas y animales de varios tamaños.

			// “Anti bajar”:  un rugido y algo parecido a unos ojos se ocultaban entre las sombras en las escaleras y fue incapaz de volver a bajar.
			// Al vivir las experiencias en las tres habitaciones (que podrían cambiar de una partida a otra), apareces en el pasillo superior con la única opción de bajar.
			// Si bajas y ya has mirado en la chimenea y visto los huesos del vampiro y en la cocina => escena final.

			// 	?: Estás de nuevo en el pasillo superior. Unos gruñidos suben del nivel inferior y debes apresurarte a entrar en una de las habitaciones

			primitives.GD_CreateMsg ("es","desc-pasillo-1", "Observas un %l1 con los miembros de la familia.")
			primitives.GD_CreateMsg ("es","desc-pasillo-2", "Aparte de eso, sólo es un pasillo que te lleva a la _habitación que preside las escaleras_ sobre la que ves un escudo con un lobo que pelea con una serpiente; la _habitación de los niños_, supones, con un póster de un grupo de rock gótico a la entrada; y una _tercera habitación_, sin nada digno de remarcar... salvo la ausencia de todo: una puerta lisa y negra, sin pomo.<br/>");
			var msg_pasillo_1 = primitives.CA_ShowMsg ("desc-pasillo-1", {l1: {id: "enlace_cuadro", txt: "cuadro"}});
			primitives.CA_ShowMsg ("desc-pasillo-2")
			primitives.GD_DefAllLinks ([{ id:msg_pasillo_1, action: { choiceId: "obj1", o1Id: "cuadro1"}}])

		}

	});

	items.push ({
		id: 'hab-padres',

		desc: function () {

			primitives.GD_CreateMsg ("es","desc-hab-padres-1", "Qué desagradable, un crucifijo invertido preside una cama de tres por tres metros, sin hacer y con las sábanas llenas de manchas cuya naturaleza quizás sea mejor no saber. Un gran espejo en el techo habla de la morbosidad de sus ocupantes.<br/>");
			primitives.CA_ShowMsg ("desc-hab-padres-1")

		}

	});

	items.push ({
		id: 'hab-hijos',

		desc: function () {

			// to-do: usar links
			// si das queso -> sale el ratón, coge queso, y se van ambos animales.
			// ¿qué pasa si no tienes el queso? En vez de resolverse la situación dando el queso, aparecería un objeto en la habitación que podrías usar ahí mismo: quizás debajo de la alfombra o similar.

			primitives.GD_CreateMsg ("es","desc-hab-hijos-1", "¿Una litera? No te quieres ni imaginar las peleas por el territorio entre los dos hermanos Raritos.<br/>");
			primitives.GD_CreateMsg ("es","desc-hab-hijos-2", "Al lado de la cama inferior, hay un agujero del tamaño de una pelota de tenis en la base de la pared, del que asoma el hocico de un ratoncito.<br/>");
			primitives.GD_CreateMsg ("es","desc-hab-hijos-3", "En otra esquina de la habitación, entre sombras, un gato mira casi todo el tiempo hacia el agujero, ignorándote activamente mientras se lame las uñas. No lo podrías jurar, pero ¿tiene maquillaje en los ojos?<br/>");

			primitives.CA_ShowMsg ("desc-hab-hijos-1")
			primitives.CA_ShowMsg ("desc-hab-hijos-2")
			primitives.CA_ShowMsg ("desc-hab-hijos-3")

			usr.setValue ({id:"ratón", value:"1"})

		}

	});

	items.push ({
		id: 'hab-abuelos',

		desc: function () {

			// objetos: ataúd, velas (link), foto (link?)-> ah! eran dos murciélagos! quizás aún tengas la posibilidad de encontrar al segundo murciélago vivo para sacarle la foto
			// Foto del abuelo Rarito y la difunta Rarita, con sendos murciélagos en sus hombros.
			// ? si persecusión externa: Los aullidos se acercan y están cada vez más cerca. Golpeas la puerta con fuerza pero no absorbe tus golpes y no devuelve ningún ruido. Cuando ya estás resignado a tu suerte, te giras. Los aullidos alcanzan un nivel de ruido te hacen mearte encima y justo cuando unas fauces ávidas de ti parecen cerrarse sobre ti caes hacia atrás y caes al suelo en vez de contra la puerta. El sonido agresivo de la bestia se transforma en silencio total.<tecla>
			// Si intentas apagar las velas =>  descubres que no desprenden calor y que no se pueden apagar.

			// Sólo puedes hacer una cosa, _abrir el ataúd_ => te sorprende la suavidad con la que se desliza la tapa. Dentro, nada, vacío. En ese momento, el silencio desaparece. Unas zarpas están razgando la puerta y oyes el sonido de la muerte aproximarte a ti. Te da pavor encerrarte en el ataúd pero tienes que elegir entre _susto_ o _muerte_.

			// Si muerte => te levantes y echas a andar un poco mareado en mitad de una multitud de sombras que se acaban transformando en zombies y fantasmas. Ves la reacción que desencadenas cuando te observan: entre admiración por llevar el disfraz más horripilante de Halloween y asco ante el olor que desprendes. Al poco tus amigos aparecen de entre la multitud y te recogen antes de que te vuelvas a desmayar. No has superado la prueba y sólo tienes un relato inverosímil que eres incapaz de contar.
			// Si susto => estás como en la mente de otra persona. Oyes como cae tierra encima del ataúd y lágrimas de personas que parecen despedirse en tu último viaje. Pero la tapa no cede. Golpeas y golpeas y sólo consigues hacerte daño en las uñas y los nudillos. Gritas pero nadie te oye. El corazón te va a mil por hora y te falta el aire, te desmayas y <tecla> Apareces en mitad del pasillo superior de la casa.

			primitives.GD_CreateMsg ("es","desc-hab-abuelos", "Suelo y paredes de mármol, gélido y un ataúd flanqueado por dos velas inmensas encendidas. Sobre el ataúd un _cuadro_.<br/>");
			primitives.CA_ShowMsg ("desc-hab-abuelos")

		}

	});

	items.push ({
		id: 'cuadro1',


		desc: function () {

			// to-do: que sea sólo visible si se tiene la linterna del móvil encendida
			// to-do: si se han visto ya todos, sólo mostrar la versión _bis

			var bis_active = (primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "generalState", "state") > 4)
			if (!bis_active) {primitives.CA_EnableChoices(false)}

			primitives.GD_CreateMsg ("es","el_cuadro_1", "la familia Rarita al completo: ");
			primitives.GD_CreateMsg ("es","el_cuadro_2", "el %l1, ");
			primitives.GD_CreateMsg ("es","el_cuadro_2_bis", "el Papá Rarito, con un lobo a sus pies; ");
			primitives.GD_CreateMsg ("es","el_cuadro_3", "la %l1, ");
			primitives.GD_CreateMsg ("es","el_cuadro_3_bis", "la Mamá Rarita, con una serpiente como bufanda; ");
			primitives.GD_CreateMsg ("es","el_cuadro_4", "la %l1, ");
			primitives.GD_CreateMsg ("es","el_cuadro_4_bis", "la Chica Rarita, acariciando con un gato negro; ");
			primitives.GD_CreateMsg ("es","el_cuadro_5", "el %l1, y ");
			primitives.GD_CreateMsg ("es","el_cuadro_5_bis", "el Niño Rarito, jugando con un ratón; ");
			primitives.GD_CreateMsg ("es","el_cuadro_6", "el %l1.<br/>");
			primitives.GD_CreateMsg ("es","el_cuadro_6_bis", "el Abuelo Rarito, con un murciélago en el hombro.<br/>");

			primitives.CA_ShowMsg ("el_cuadro_1")
			var msg_cuadro_2 = primitives.CA_ShowMsg ("el_cuadro_2", {l1: {id: "cuadro_2", txt: "Papá Rarito"}}, !bis_active)
			var msg_cuadro_2_bis = primitives.CA_ShowMsg ("el_cuadro_2_bis", undefined, bis_active)
			var msg_cuadro_3 = primitives.CA_ShowMsg ("el_cuadro_3", {l1: {id: "cuadro_3", txt: "Mamá Rarita"}}, !bis_active)
			var msg_cuadro_3_bis = primitives.CA_ShowMsg ("el_cuadro_3_bis", undefined, bis_active)
			var msg_cuadro_4 = primitives.CA_ShowMsg ("el_cuadro_4", {l1: {id: "cuadro_4", txt: "Chica Rarita"}}, !bis_active)
			var msg_cuadro_4_bis = primitives.CA_ShowMsg ("el_cuadro_4_bis", undefined, bis_active)
			var msg_cuadro_5 = primitives.CA_ShowMsg ("el_cuadro_5", {l1: {id: "cuadro_5", txt: "Niño Rarito"}}, !bis_active)
			var msg_cuadro_5_bis = primitives.CA_ShowMsg ("el_cuadro_5_bis", undefined, bis_active)
			var msg_cuadro_6 = primitives.CA_ShowMsg ("el_cuadro_6", {l1: {id: "cuadro_6", txt: "Abuelo Rarito"}}, !bis_active)
			var msg_cuadro_6_bis = primitives.CA_ShowMsg ("el_cuadro_6_bis", undefined, bis_active)

			primitives.GD_DefAllLinks ([
				{ id: msg_cuadro_2, changeTo: msg_cuadro_2_bis, userCode: {functionId: "setFrame", par: {pnj:"padre"} } },
				{ id: msg_cuadro_3, changeTo: msg_cuadro_3_bis, userCode: {functionId: "setFrame", par: {pnj:"madre"} } },
				{ id: msg_cuadro_4, changeTo: msg_cuadro_4_bis, userCode: {functionId: "setFrame", par: {pnj:"chica"} }	},
				{ id: msg_cuadro_5, changeTo: msg_cuadro_5_bis, userCode: {functionId: "setFrame", par: {pnj:"niño"} } 	},
				{ id: msg_cuadro_6, changeTo: msg_cuadro_6_bis, userCode: {functionId: "setFrame", par: {pnj:"abuelo"} } }
			])

		}

	});


	items.push ({
		id: 'chimenea',


		desc: function () {

			var jaulaVisto = (usr.getValue ({id:"jaula"}) != "0")

			primitives.GD_CreateMsg ("es","chimenea_1", "Entre carbón y madera quemada observas los restos de %l1.");
			primitives.GD_CreateMsg ("es","chimenea_1_bis", "Entre carbón y madera quemada observas los restos de una jaula chamuscada. ");

			var msg_chimenea_1 = primitives.CA_ShowMsg ("chimenea_1", {l1: {id: "chimenea_1", txt: "una jaula chamuscada"}}, !jaulaVisto)
			var msg_chimenea_1_bis = primitives.CA_ShowMsg ("chimenea_1_bis", false, jaulaVisto)

			var huesosVisto = (usr.getValue ({id:"huesos"}) != "0")

			primitives.GD_CreateMsg ("es","chimenea_2", "Dentro puedes ver unos %l1 ")
			primitives.GD_CreateMsg ("es","chimenea_2_bis", "Dentro puedes ver unos pequeños huesitos, ")
			var msg_chimenea_2 = primitives.CA_ShowMsg ("chimenea_2", {l1: {id: "chimenea_2", txt: "pequeños huesitos."}}, jaulaVisto & !huesosVisto)
			var msg_chimenea_2_bis = primitives.CA_ShowMsg ("chimenea_2_bis", undefined, jaulaVisto & huesosVisto)

			primitives.GD_CreateMsg ("es","chimenea_3", ", como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes _sacarle una foto a la jaula y volverte a casa_, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.");
			var msg_chimenea_3 = primitives.CA_ShowMsg ("chimenea_3", undefined, jaulaVisto & !huesosVisto)

			primitives.GD_DefAllLinks ([
				{ id: msg_chimenea_1, changeTo: msg_chimenea_1_bis, visibleToTrue: [msg_chimenea_2], userCode: {function:'setValue', param: {id:"jaula", value:"1"}} },
				{ id: msg_chimenea_2, changeTo: msg_chimenea_2_bis, visibleToTrue: [msg_chimenea_3] , userCode: {function:'setValue', param: {id:"huesos", value:"1"}} }
			])
		}

	});

	items.push ({
		id: 'nevera',

		desc: function () {

			var item1 = primitives.IT_X("nevera")
			if (primitives.IT_GetAttPropValue (item1, "generalState", "state") == "0") {
				primitives.GD_CreateMsg ("es","desc_nevera", "La abres con repuganancia y descubres con sorpresa que está fría. Tiene una lucecita encendida en el interior, a pesar de que el cable que sale de la nevera cuelga, pelado, sin conectar a ningún enchufe.")
				primitives.CA_ShowMsg ("desc_nevera")
				primitives.IT_SetAttPropValue (item1, "generalState", "state", "1");
				// que no pasen a estar en la nevera hasta que se describa la primera vez
				primitives.IT_SetLoc(primitives.IT_X("botella"), item1);
				primitives.IT_SetLoc(primitives.IT_X("taper"), item1);
				primitives.IT_SetLoc(primitives.IT_X("dinamita"), item1);
				primitives.IT_SetLoc(primitives.IT_X("queso"), item1);
			} else {
				primitives.GD_CreateMsg ("es","desc_nevera_2", "La vuelves a abrir, fascinado por su repugnancia.")
				primitives.CA_ShowMsg ("desc_nevera_2")
			}

			var botellaHay = (primitives.IT_GetLoc(primitives.IT_X("botella")) == item1)
			var taperHay = (primitives.IT_GetLoc(primitives.IT_X("taper")) == item1)
			var dinamitaHay = (primitives.IT_GetLoc(primitives.IT_X("dinamita")) == item1)
			var quesoHay = (primitives.IT_GetLoc(primitives.IT_X("queso")) == item1)
			var mostrarContenido = (botellaHay || taperHay || dinamitaHay || quesoHay)
			var botellaVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("botella"), "generalState", "state") == "1")
			var taperVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("taper"), "generalState", "state") == "1")
			var dinamitaVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("dinamita"), "generalState", "state") == "1")
			var quesoVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("queso"), "generalState", "state") == "1")

			primitives.GD_CreateMsg ("es", "dentro_de_nevera", "Dentro de la nevera hay:<br/>");
			primitives.CA_ShowMsg ("dentro_de_nevera", undefined, mostrarContenido)

			primitives.GD_CreateMsg ("es","desc_botella_1", "- %l1<br/>");
			var msg_desc_botella_1 = primitives.CA_ShowMsg ("desc_botella_1",  {l1: {id: "desc_botella_1", txt: "una botella"}} , botellaHay && !botellaVisto)
			primitives.GD_CreateMsg ("es","desc_botella_1_bis", "- una botella con un líquido rojo que no parece vino.<br/>");
			var msg_desc_botella_1_bis = primitives.CA_ShowMsg ("desc_botella_1_bis", undefined , botellaHay && botellaVisto)

			primitives.GD_CreateMsg ("es","desc_taper_1", "- %l1<br/>");
			var msg_desc_taper_1 = primitives.CA_ShowMsg ("desc_taper_1",  {l1: {id: "desc_taper_1", txt: "un táper"}} , taperHay && !taperVisto)
			primitives.GD_CreateMsg ("es","desc_taper_1_bis", "- un  táper con cosas moviéndose dentro.<br/>");
			var msg_desc_taper_1_bis = primitives.CA_ShowMsg ("desc_taper_1_bis", undefined , taperHay && taperVisto)

			primitives.GD_CreateMsg ("es","desc_dinamita_1", "- %l1<br/>");
			var msg_desc_dinamita_1 = primitives.CA_ShowMsg ("desc_dinamita_1",  {l1: {id: "desc_dinamita_1", txt: "una barra de dinamita"}} , dinamitaHay && !dinamitaVisto)
			primitives.GD_CreateMsg ("es","desc_dinamita_1_bis", "- una barra de dinamita, ¿en serio?<br/>");
			var msg_desc_dinamita_1_bis = primitives.CA_ShowMsg ("desc_dinamita_1_bis", undefined , dinamitaHay && dinamitaVisto)

			primitives.GD_CreateMsg ("es","desc_queso_1", "- %l1<br/>");
			var msg_desc_queso_1 = primitives.CA_ShowMsg ("desc_queso_1",  {l1: {id: "desc_queso_1", txt: "queso"}} , quesoHay && !quesoVisto)
			primitives.GD_CreateMsg ("es","desc_queso_1_bis", "- queso maloliente<br/>");
			var msg_desc_queso_1_bis = primitives.CA_ShowMsg ("desc_queso_1_bis", undefined , quesoHay && quesoVisto)

			primitives.GD_CreateMsg ("es","desc_nevera_3", "Pero ya no queda nada de su contenido original.<br/>");
			primitives.CA_ShowMsg ("desc_nevera_3", undefined, !mostrarContenido)

			primitives.GD_DefAllLinks ([
				{ id: msg_desc_botella_1, changeTo: msg_desc_botella_1_bis,
					userCode: {functionId: "setValue", par: {id:"botella", value:"1"}}
				},
				{ id: msg_desc_taper_1, changeTo: msg_desc_taper_1_bis,
					userCode: {functionId: "setValue", par: {id:"taper", value:"1"}}
				},
				{ id: msg_desc_dinamita_1, changeTo: msg_desc_dinamita_1_bis,
					userCode: {functionId: "setValue", par: {id:"dinamita", value:"1"}}
				},
				{ id: msg_desc_queso_1, changeTo: msg_desc_queso_1_bis,
					userCode: {functionId: "setValue", par: {id:"queso", value:"1"}}
				}
			])

		}

	});

	items.push ({
		id: 'espejo',


		desc: function () {

			primitives.GD_CreateMsg ("es","espejo_1", "desc espejo");
			var msg_espejo_1 = primitives.CA_ShowMsg ("espejo_1" )

		}

	});

	items.push ({
		id: 'póster',


		desc: function () {

			primitives.GD_CreateMsg ("es","póster_1", "Ves las ropas y poses típicas de un grupo de rock gótico llamado Los Ultratumba y una estrofa de una cancion del grupo.");
			primitives.GD_CreateMsg ("es","póster_2", "La canción reza así:");
			primitives.GD_CreateMsg ("es","póster_3", "Dame tu sangre<br/>Si quieres entrar<br/>Dame su sangre<br/>Al mundo infernal.<br/>");

			primitives.CA_ShowMsg ("póster_1" )
			primitives.CA_ShowMsg ("póster_2" )
			primitives.CA_PressKey ("tecla");
			primitives.CA_ShowMsg ("póster_3" )
			usr.setValue ({id:"póster", value:"1"})

		}
	});

	items.push ({
		id: 'ratón',

		desc: function () {

			primitives.GD_CreateMsg ("es","ratón_1", "Desc ratón");
			primitives.CA_ShowMsg ("ratón_1" )
		}
	});

	items.push ({
		id: 'gato',

		desc: function () {

			primitives.GD_CreateMsg ("es","gato_1", "Desc gato");
			primitives.CA_ShowMsg ("gato_1" )
		}
	});


		items.push ({
			id: 'ratón',

			desc: function () {

				primitives.GD_CreateMsg ("es","ratón_1", "Desc ratón");
				primitives.CA_ShowMsg ("ratón_1" )
			}
		});

		items.push ({
			id: 'gato',

			desc: function () {

				primitives.GD_CreateMsg ("es","gato_1", "Desc gato");
				primitives.CA_ShowMsg ("gato_1" )
			}
		});

}

// GENERIC turn **********************************************************************************************

function turn (indexItem) {

	var  primitives = this.primitives // tricky

	// cuando se alcance time-out se pueden acelerar algunas escenas (simplemente se confía en que el jugados se mueve de un lado a otro):
	// to-do: si en hab-hijos y gato.state = 0 => se lanza escena de pelea entre gato y ratón
	// to-do: si en cocina y no se tiene sangre => se lanza escena de la dinamita
	// to-do: si en cocina y ratón.state = 0 => se coge queso (que no se permite dejar)
	// to-do: si en pasillo y no se tiene sangre => lees póster si no lo has hecho
	// to-do: si en pasillo y no se ha entrado en hab-padres, se entra
	// to-do: si en pasillo, sangre, y no se ha entrado en hab-abuelo, se entra

	// si a pesar de todo, no se han vivido todas las experiencias  de igual manera se va al hall y llega la familia Rarita.

}


// internal functions ****************************************************************************************************************

usr.rellenaCeros = function (n, width) {
	// uso: rellenaCeros(10, 4) ->  // 0010
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

usr.demo_action = function (par) {
  alert ("PNJ: " + par.pnj + ": " + JSON.stringify (par))
}

usr.goto = function (par) { // par.target

	var  primitives = this.primitives // tricky

  console.log ("usr.goto: " + JSON.stringify (par))

	// transición
//	if (par.target == "porche") {
		primitives.GD_CreateMsg ("es", "de_intro_a_porche", "Casi trastabillas y te caes, te arañas con los arbustos, y casi pierdes del móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
		primitives.CA_ShowMsg ("de_intro_a_porche")
		primitives.CA_PressKey ("tecla");
//	}

	var loc = primitives.IT_X(par.target)
	// movimiento
	primitives.PC_SetCurrentLoc (loc)

	// redescribe
	primitives.CA_ShowDesc (loc)
	primitives.CA_Refresh()

}


usr.setFrame = function (par) { // par.pnj

	var primitives = this.primitives // tricky
	var status = {}

	primitives.CA_EnableChoices(true)

  console.log ("usr.setFrame: " + JSON.stringify (par))

  var value = primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "generalState", "state")
	console.log ("value: " + value)
	value++
	// incrementa valor
	primitives.IT_SetAttPropValue (primitives.IT_X("cuadro1"), "generalState", "state", value)
	if (value > 4) {
			status.enableChoices = true
	}

	return status
}

usr.setValue = function (par) { // par.id, par.value
	var primitives = this.primitives // tricky

  primitives.IT_SetAttPropValue (primitives.IT_X(par.id), "generalState", "state", par.value)
}

usr.getValue = function (par) { // par.id
	var primitives = this.primitives // tricky

  return primitives.IT_GetAttPropValue (primitives.IT_X(par.id), "generalState", "state")
}

usr.hiddenScene = function (par) { // par.pnj

	var primitives = this.primitives // tricky

	// "Créditos: Escena oculta 1:"
	// Hijo: ¿Habéis visto que hay alguien escondido detrás de los arbustos del jardín?
	// Padre: Sí, creo que es un compañero de clase, un friki de los juegos de rol.
	// El coche sale del aparcamiento de la casa.
	// Hijo:  ¿Viste, papá? No ha esperado ni a que giremos para entrar como un tiro en la casa.
	// Chica: Mirad allá, ese grupito de adolescentes en círculo de la esquina que no deja de lanzar miradas, además de a sus móviles, a la casa y al coche, son sus amiguetes. ¿Qué estarán tramando?
	// Abuelo: No os preocupéis, familia, ya sabéis que nuestras mascotas no permitirán que pase nada… que no deba pasar… ja, ja, ja…

}

usr.escena_espejo= function () {

	var primitives = this.primitives // tricky

	primitives.GD_CreateMsg ("es","desc_espejo_1", "Lo observas absorto... las sombras en la cama parecen cobrar forma, una forma se mueve como, no!, es una serpiente de dos metros de manchas rojas y verdes, que se enrosca alrededor tuyo y aprieta sin dejarte respirar. Pierdes el aliento y caes al suelo.")
	primitives.GD_CreateMsg ("es","desc_espejo_2", "Al despertar descubres que estás fuera de la habitación, que está ahora cerrada con llave.")

	primitives.CA_ShowMsg ("desc_espejo_1")
	primitives.CA_PressKey ("tecla");
	primitives.CA_ShowMsg ("desc_espejo_2")
	primitives.CA_PressKey ("tecla");

	usr.setValue ({id:"espejo", value:"1"})
	primitives.CA_PressKey ("tecla");

}
