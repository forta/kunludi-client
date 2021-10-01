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
Transitando a lib 0.02 para mejorar la visibilidad del código y hacerlo más compacto.

En vez de primitives.IT_XXXXXX (o .CA_ , o .GD_XXXXX) se usa kl.it("code", par1, par2, ...) , que internamente remite a los ya existentes, que pasarán más adelante a ser privados.

Revisar primero si las funciones actuales de la librería se usan en algún juego, para hacer limpia si no se usan.

Ejemplos:
	antes: primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state") == "0")
	ahora: kl.it ("getatt", par_c.loc, "generalState", "state") == "0")

	antes: primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)
	ahora: kl.it ("setatt", par_c.loc, "generalState", "state", "0")

	antes: primitives.GD_CreateMsg ("es", "Prueba oculta", "Prueba oculta<br/>")
	ahora: kl.gd ("createmsg", "es", "Prueba oculta", "Prueba oculta<br/>")

	antes: primitives.CA_ShowMsg ("sueño1")
	ahora: kl.ca ("showmsg", "sueño1")

	antes: primitives.CA_PressKey ("pulsa_avanzar")
	ahora: kl.ca ("presskey", "pulsa_avanzar")

*/

// ============================

let initReactions =  function  (reactions, primitives) {

	// acciones de lib deshabilitadas
	reactions.push ({ id: 'jump', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'sing', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'wait', enabled: function (indexItem, indexItem2) {		return false		}	});


	reactions.push ({
		id: 'look',

		reaction: function (par_c) {

			if (par_c.loc == primitives.IT_X("intro")) {

				primitives.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Los Raritos, participante en la %l1.<br/>");
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
				  { id:intro2, visibleToFalse: [intro1, intro2], visibleToTrue: [intro3], action: {actionId: "go", dId :"fuera"}},
					{ id:consi0, visibleToFalse: [consi0], visibleToTrue: [consi1]},
					{ id:consi1, visibleToFalse: [consi1], visibleToTrue: [consi2]},
					{ id:consi2, visibleToFalse: [consi2], visibleToTrue: [intro3], action: {actionId: "go", dId :"fuera"}}
				])

				return true
			} else if (par_c.loc == primitives.IT_X("fuera")) {
					// to-do: sólo si el móvil está presente
					primitives.GD_CreateMsg ("es","test", "test<br/>");
					primitives.CA_ShowMsg ("test")
					return true;
				}
		}

	}); // look

	reactions.push ({
		id: 'go',

		reaction: function (par_c) {

			if (par_c.loc == primitives.IT_X("intro")) {
				primitives.GD_CreateMsg ("es","test", "test<br/>");
				primitives.CA_ShowMsg ("test")

				primitives.GD_CreateMsg ("es","Móvil sólo recibe", "Tus fabulosos amigos al menos te han dejado un %l1, si bien sólo está configurado para sacar fotos y recibir llamadas.<br/>");
				var msg_movil = primitives.CA_ShowMsg ("Móvil sólo recibe", {l1: {id: "enlace-móvil", txt: "móvil"}});
				primitives.GD_DefAllLinks ([{ id:msg_movil, item: {o1Id: "móvil"}}])

				return true;
			}
		}

	}); // go

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


	items.push ({
		id: 'móvil',

		desc: function () {

			primitives.CA_ShowMsg ("móvil")


		}

	});

}

// GENERIC turn **********************************************************************************************

function turn (indexItem) {

	var  primitives = this.primitives // tricky



}


// internal functions ****************************************************************************************************************
