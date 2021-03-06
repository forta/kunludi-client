//Section 1a: gameReaction (lib overwrite)
//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: game functions

// **********************************************
//Section 1: gameReaction
// **********************************************

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
	getItem:getItem,
	getReaction:getReaction
}

function getItem (itemId) {
	var itemIndex = arrayObjectIndexOf(this.items, "id", itemId);

	if (itemIndex>-1) {
		return this.items[itemIndex]
	}

}

function getReaction (itemId) {
	var reactionIndex = arrayObjectIndexOf(this.reaction, "id", itemId);

	if (reactionIndex>-1) {
		return this.reactions[reactionIndex]
	}

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


// ============================

let initReactions =  function  (reactions, primitives) {

	reactions.push ({
		id: 'drink',
		reaction: function (par_c, fromDown) {
			return usr.reactionManghi_Trinki (this.id, this.libIndex, par_c, fromDown);
		}
	});

	reactions.push ({
		id: 'eat',
		reaction: function (par_c, fromDown) {
			return usr.reactionManghi_Trinki (this.id, this.libIndex, par_c, fromDown);
		}
	});

	reactions.push ({
		id: 'climb', // grimpi

		enabled: function (indexItem,indexItem2) {
			return true;
		},

		reaction: function (par_c) {

			if ( (primitives.PC_GetCurrentLoc() == primitives.IT_X("loc_al_la_shipo")) &&
				 (primitives.IT_IsCarriedOrHere (primitives.IT_X("obj_pendanta_??nuro"))) ) {
				// fakte, nue se sxnuro jam jetita
				primitives.CA_ShowMsg ("Vi grimpas en la pendanta ??nuro,$D kelkfoje ??i preska?? rompi??as, $D sed vi sukcesas grimpi ??is la rando.$D");
				primitives.PC_SetCurrentLoc (primitives.IT_X("loc_sur_la_shipo"));
				return true;
			}
			return false;
			primitives.CA_ShowMsg ("Vi ne scias kiel grimpi");

		},

	});


	reactions.push ({
		id: 'dig_with',
		enabled: function (indexItem,indexItem2) {
			 return primitives.PC_CheckCurrentLocId ("loc_okcidenta_strando");
		}
	});


	reactions.push ({
		id: 'swim',
		enabled: function (indexItem,indexItem2) {
			 return (primitives.PC_CheckCurrentLocId("loc_al_la_shipo"));
		},
		reaction: function (par_c) {
			if (primitives.PC_CheckCurrentLocId("loc_al_la_shipo")) {
				primitives.CA_ShowMsg("Vi na??as en la maro");
				primitives.PC_GO_TO ("loc_sur_la_shipo");
				return true;
			}
			return false;
		}
	});

	reactions.push ({
		id: 'investigate',
		enabled: function (indexItem,indexItem2) {
			  return (primitives.PC_CheckCurrentLocId("loc_baborda_mezshipo") ||
					  primitives.PC_CheckCurrentLocId("loc_anta??a_kajuto"));
		},
		reaction: function (par_c) {
			if (primitives.PC_CheckCurrentLocId("loc_baborda_mezshipo")) {
				primitives.CA_ShowMsg("Vi ne retrovas la ??nuron a?? la hokon.");
				return true;
			} else if (primitives.PC_CheckCurrentLocId("loc_anta??a_kajuto")) {
				primitives.CA_ShowMsg("Se vi bone ser??as en la fojno vi rimarkas ke la dorminto gardis ??i tie oran moneron.");
				primitives.IT_BringHere (primitives.IT_X("obj_ora_monero"));
				return true;
			}
		}

	});

	reactions.push ({
		id: 'jump',
		reaction: function (par_c) {

			if (primitives.PC_CheckCurrentLocId("loc_baborda_mezshipo")){
				primitives.CA_ShowMsg("Vi saltas malsupren de la ??ipo.");
				primitives.PC_SetCurrentLoc (primitives.IT_X("loc_salti_de_la_shipo"));
				return true;
			}
			return false;
		}
	});

	reactions.push ({
		id: 'untie',
		enabled: function (indexItem,indexItem2) {
			  return (primitives.PC_CheckCurrentLocId("loc_sub??ipo"));
		},
		reaction: function (par_c) {
			if (primitives.PC_CheckCurrentLocId("loc_sub??ipo")) { // ??? for any object???
				primitives.CA_ShowMsg("Bone, vi estas heroo!$D La knabo diras al vi ke ili simple ludis sur la strando kaj tiam trovis la keston.$D ??e la pirat??ipo iu a??a severa pirato kunportis ilin ??i tien.");
				primitives.PC_SetCurrentLoc (primitives.IT_X("loc_fino"));
				return true;
			}
			return false;
		}
	});



	reactions.push ({
		id: 'smell',
		enabled: function (indexItem,indexItem2) {
			 return (indexItem == primitives.IT_X("obj_dormanta_matroso"));
		}
	});


	reactions.push ({
		id: 'attack',
		enabled: function (indexItem,indexItem2) {
			if (primitives.IT_ATT(indexItem, "hasEnergy")) return true;
		},
		reaction: function (par_c) { // complex RPG combat
			return usr.combat(par_c.pc, par_c.item1, -1);
		}
	});

	reactions.push ({
		id: 'take',
		enabled: function (indexItem,indexItem2) {
			if ((indexItem == primitives.IT_X("obj_malnova_sako")) ||  (indexItem == primitives.IT_X("obj_pendanta_??nuro_2")))
				return true;
		}
	});

	reactions.push ({
		id: 'open',
		enabled: function (indexItem,indexItem2) {
			 return ((indexItem == primitives.IT_X("obj_ligna_kesto")) ||
					 (indexItem == primitives.IT_X("obj_ligna_kesto_3"))) ;
		}
	});

	reactions.push ({
		id: 'burn',
		enabled: function (indexItem,indexItem2) {
			 return ((indexItem == primitives.IT_X("obj_sisala_??nuro")) ||
					 (indexItem == primitives.IT_X("obj_pendanta_??nuro")) ||
					 (indexItem == primitives.IT_X("obj_pendanta_??nuro_2")) ||
					 (indexItem == primitives.IT_X("obj_malseka_fojno")));
		}
	});

	reactions.push ({ // 2 par ??? !!!
		id: 'throwAction',
		enabled: function (indexItem,indexItem2) {
			 return ((indexItem == primitives.IT_X("obj_sisala_??nuro")) &&
					 (indexItem2 == primitives.IT_X("obj_pirata_??ipo")));
		}
	});

	reactions.push ({
		id: 'pull',
		enabled: function (indexItem,indexItem2) {
			 return (indexItem == primitives.IT_X("obj_pendanta_??nuro"));
		}
	});

	reactions.push ({
		id: 'raise',
		enabled: function (indexItem,indexItem2) {
			return (indexItem == primitives.IT_X("obj_fera_ankra??eno"));
		}
	});

	reactions.push ({
		id: 'strike',
		enabled: function (indexItem,indexItem2) {
			 return (indexItem == primitives.IT_X ("nprimitives.PC_forta_pirato"));
		}
	});


}


// **********************************************



// NPC turns
/*
MANGHEMO    PozNum;    { Se manghas ion:  Agreso:= Agreso - Maghemo }
 | TRINKEMO    PozNum;    { Se trinkas ion: Agreso:= Agreso - Trinkemo }
 | ATAKO       PozNum;    { SHanco ke trafas karakteron se atakas,
                            Kutime inter 0 kaj 100 }
 | AGRESO      Num;       { Indikas Atakemo, chi numero shanghighas dum la ludo
                            kutime grandighas, se je iu momento > 0 la
                            monstro povas ataki }
 | PROTEKTO    PozNum;    { Indikas malfacileco trafi la monstron }
 | VIVOJ       PozNum;    { Se iam <= 0: mortas }
 | FUGHEMO     PozNum;    { Sen indiko: 0, neniam fughas, alie: shanco }
 | VAGEMO      PozNum;    { Sen indiko: 0, neniam vagas, alie: shanco }

   | PERPAFI       PozNum;      { Se trafas:
                                 Vivoj:= Vivoj - HazardNumero(PerPafi) }
  | SHARGO        PozNum;      { Kiom ofte pafi per ghi }
  | PERBATI       PozNum;      { Se trafas:
                                 Vivoj:= Vivoj - HazardNumero(PerBati) }
  | PERPIKI       PozNum;      { Se trafas:
                                 Vivoj:= Vivoj - HazardNumero(PerPiki) }
  | MANGHEBLO     PozNum;      { Se manghata aw trinkata, shangho de
                                 satignombron. }
  | TRINKEBLO     PozNum;      { Se manghata aw trinkata, shngho de
                                 malsoifignombron. }
  | FAJRODAWRO    PozNum;      { Se brulas, kiam longe ghis elbrulas }
  | FINO          PozNum;      { Se en iu loko, chiu vico minus unu,
                                 kiam ighas nul, tiam Fenomenas Fini }

 */





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
		id: 'nprimitives.PC_ebria_matroso',

		turn:function() {

			var obj2 = -1; // to-do:  kion manghi
			if (obj2 == primitives.IT_X("obj_irlanda_viskio")) {
				primitives.CA_ShowMsg("La matroso trinkas la viskion,$D post kelkaj  momentoj li endormi??as.");
				primitives.IT_BringHere (primitives.IT_X("obj_malplena_viskibotelo"));
				primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_dormanta_matroso"));
				return true;
			}
		}

	});

	items.push ({
		id: 'obj_ligna_kesto',
		open: function() {
			primitives.CA_ShowMsg("La ??arniro knaras$D kiam vi malfermas la malnovan keston.$D.");
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_en_la_kavo_2")); // salto al mapa alternativo
			return true; // done
		}
	});

	items.push ({
		id: 'obj_ligna_kesto_3',
		open: function() {
			primitives.CA_ShowMsg("??i estas ??losita per seruro!"); // nosotros, lo haremos usando un atributo?
			return true; // done
		}
	});

	items.push ({
		id: 'loc_dunvojo',

		look_dir_disabled: function (dirIndex) {
			if (dirIndex <0) return ;

			if (dirIndex == DIR_GetIndex("d180")) {
				primitives.CA_ShowMsg ("EL_duonvojo_AL_urbo");
			}

		},

		firstDesc: function (indexItem2) {
			primitives.CA_ShowMsg ("Introduction");
			primitives.CA_ShowMsgAsIs ("<p></p>");

		}

	});


	items.push ({
		id: 'obj_plastika_??ovelilo',
		dig_with: function() {
			if (primitives.PC_CheckCurrentLocId ("loc_okcidenta_strando")) {
				showText ("Per tiu infana ??ovelilo vi nur kapablas fosi malgrandan truon. ??ar vi uzas tro multe da forto, vi rompas la ??ovelilon.");
				primitives.IT_SetLoc ("obj_plastika_??ovelilo", "loc_limbo");
				return true; // done
			}
			return false; // nothing done in item scope
		}
	});

	items.push ({
		id: 'obj_irlanda_viskio',
		drink: function() {
			if  (loc("loc_mortas")) {
				primitives.CA_ShowMsg("Vi trinkas la viskion.$D Vi ebrii??as kaj endormi??as mallongan tempon,$D kiam vi denove veki??as la kapitano ??eestas.");
				primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_malplena viskibotelo"));
				primitives.IT_BringHere (primitives.IT_X("nprimitives.PC_pirata_kapitano"));
				Loko("loc.kajuto"); //???
				return true; // done
			}
		}
	});

	items.push ({
		id: 'obj_plena_bierbotelo',
		drink: function() {
			/*
			if (MonstroParametro("io")) { // en realidad es evento de monstro y el this.index apuntar?? al monstruo
				primitives.CA_ShowMsg("La $M trinkas la bieron kaj forjhetas la botelon."); // $M: la mostro
				primitives.IT_BringHere (primitives.IT_X("obj_malplena_bierbotelo"));
				return true; // done
			}
			*/
			primitives.CA_ShowMsg("La biero (grol??o) ege bongustas, ??ar la botelo estis sufi??e malvarma. Vi do tute ne plu soifas.");
			primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_malplena_bierbotelo"));
			primitives.PC_Points (5);
			return true;
		}
	});

	items.push ({
		id: 'obj_kokakolaa_boteleto',
		drink: function() {
			/*
			if (MonstroParametro("io")) { // evento???
				primitives.CA_ShowMsg("La $M ne volas trinki la kokakolaon ??ar tiu trinka??o malbone gustas."); // $M: la mostro
				return true; // done
			}
			*/
			primitives.CA_ShowMsg("Se vi trinkas la kokakolaon, la gusto ne pla??as al vi. Sed vi soifas do eltrinkas la tutan boteleton.");
			//// primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_malplena_boteleto"));
			return false; // general game reaction continues
		}
	});


	items.push ({
		id: 'obj_dormanta_matroso',
		listen: function() {
			primitives.CA_ShowMsg("Vi a??das ronkantan matroson.");
			return true; // done
		},
		smell: function() {
			primitives.CA_ShowMsg("Vi flaras la acidan odoron de la matrosa vomado.")
			return true; // done
		},
		wakeup: function() {
			primitives.CA_ShowMsg("Estas malfacile veki ebrian matroson.$D Sed tamen post iom da tempo vi sukcesas.$D Sed la matroso furiozas kaj batas vin.$D a??!$D");
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_mortas"));
			return true; // done
		},
		attack: function() {
			primitives.CA_ShowMsg("Nun la matroso mortas.");
			primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_morta_matroso"));
			return true; // done
		}
	});


	items.push ({
		id: 'obj_malnova_sako',
		take: function() {
			primitives.IT_SetLoc (this.index, primitives.PC_X());
			primitives.CA_ShowMsg("Vi vidas ke sub la sako trovi??as iu metala a??o.");
			primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_malnova_sako_2"));
			var indexMetalaAjho = primitives.IT_X("obj_metala_a??o");
			primitives.IT_SetLoc (indexMetalaAjho, primitives.PC_GetCurrentLoc());
			primitives.IT_SetAttPropValue (indexMetalaAjho, "hasDecrementor", "active", "true"); // bomb counter starts
			return true;
		}
	});

	items.push ({
		id: 'obj_metala_a??o',

		turn: function() {
			if (primitives.IT_GetId(primitives.IT_GetLoc(this.index)) == "limbo") return;
			if (primitives.IT_GetAttPropValue (this.index, "hasDecrementor", "active") == "false") return;

			// kiam dekrementilo nulas (startas je 5), eksplodo
			if (primitives.IT_GetAttPropValue (this.index, "hasDecrementor", "counter") == "0") {
				// eksplodo
				primitives.IT_SetAttPropValue (this.index, "hasDecrementor", "active", "false");

				// monstroj_fugxas_el_cxi_tie();
				if (primitives.IT_IsCarriedOrHere(this.index)) {
					primitives.CA_ShowMsg("La bombo eksplodas.");
					primitives.PC_SetCurrentLoc (primitives.IT_X("loc_post_eksplodo"));
					primitives.CA_ShowDesc (primitives.PC_GetCurrentLoc());
					primitives.CA_EndGame ();
				} else {
					primitives.CA_ShowMsg("Vi a??das grandan eksplodon.");
				}

				primitives.IT_SetLocToLimbo (this.index);
			} else {
				primitives.IT_IncrAttPropValue (this.index, "hasDecrementor", "counter", -1);
			}
		}
	});


	items.push ({
		id: 'obj_sisala_??nuro',
		burn: function() {
			primitives.CA_ShowMsg("La ??nuro elbrulis,$D la hoko restas.");
			primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_metala_hoko"));
			return true;
		},
		throwAction: function(par_c) {
			if ( (par_c.item2 != primitives.IT_X('obj_pirata_??ipo')) && (par_c.item2 != primitives.IT_X('obj_pirata_??ipo')) ){
				primitives.CA_ShowMsg("Kien?"); // LUDI-a aldonajxo
				return true;
			}
			primitives.CA_ShowMsg("Vi jhetas la ??nuron al la ??ipo,$D kaj la hoko hokas malanta?? la ??iprando, la ??nuro pendas al la hoko.");
			primitives.IT_ReplacedBy (primitives.IT_X("obj_sisala_??nuro"), primitives.IT_X("obj_pendanta_??nuro"));
			primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_pirata_??ipo_2"));
			primitives.PC_Points(1);
			return true;
		}
	});

	items.push ({
		id: 'obj_pendanta_??nuro',
		burn: function() {
			if (primitives.IT_IsHere(primitives.IT_X("obj_pirata_??ipo_2"))) {
				primitives.CA_ShowMsg("La ??nuro forbrulis.");
				primitives.IT_SetLocToLimbo(this.index);
				primitives.IT_ReplacedBy (primitives.IT_X("obj_pirata_??ipo_2"), primitives.IT_X("obj_pirata_??ipo"));
				return true; // done
			}
			return false; // nothing done in item scope
		},
		pull: function () {
			if (primitives.IT_IsHere(primitives.IT_X("obj_pirata_??ipo"))) {
				primitives.CA_ShowMsg("Kiam vi tiras al la ??nuro, vi tiras iomete tro forte por la foruzita ??nuro,$D ??i rompi??as.");
				primitives.IT_ReplacedBy (primitives.IT_X("obj_pendanta_??nuro"), primitives.IT_X("obj_rompita_??nuro"));
				primitives.IT_ReplacedBy(primitives.IT_X("obj_pirata_??ipo_2"), primitives.IT_X("obj_pirata_??ipo"));
				return true; // done
			}
			return false; // nothing done in item scope
		}
	});

	items.push ({
		id: 'obj_pendanta_??nuro_2',
		take: function() {
			// loc_sur_la_shipo ?
			primitives.CA_ShowMsg("Vi klopodas perforte forigi la hokon de la rando, unue ??ajnas ke vi estas sen??anca.$D Sed vi da??rigas vian laboron kaj finfine sukcesas, nur tio okazis tiel neanta??vidita ke la ??nuro kun hoko subite falas el viaj manoj.");
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_baborda_mezshipo"));
			return true;
		}
	});

	items.push ({
		id: 'obj_pendanta_??nuro_2',
		burn: function() {
			primitives.CA_ShowMsg("La ??nuro forbrulis kaj falas teren.");
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_baborda_mezshipo"));
			return true; // done
		}
	});

	items.push ({
		id: 'obj_malseka_fojno',
		burn: function() {
			primitives.CA_ShowMsg("La fojno facile ekbrulas,$D e?? tiel facile ke ne nur la fojno fajras, sed la tuta ??ipo.");
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_??ipo_en_fajro"));
			return true; // done
		}
	});

	items.push ({
		id: 'nprimitives.PC_bruna_rato',
		throwAction: function() {
			primitives.CA_ShowMsg("  Vi ???etas la $Pn al la $M.$D Vi preska?? trafis ??in,$D malfeli??e por vi, ??i nun e?? pli agresivas.$D Do post mallonga tempo la $M ekkuras al vi.$D Vi pensas rapide kaj konkludas ke vi tute ne havas ??ancon do vi forkuras en paniko.$D");
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_perdita_en_dunoj"));
			return true; // done
		}
	});

	items.push ({
		id: 'obj_fera_ankra??eno',
		raise: function() {
			primitives.CA_ShowMsg("Kiam vi levas la ankron la veloj elvolvi??as,$D la vento blovas en ilin kaj la ??ipo ekmovi??as.$D Vi velas al iu alia insulo kaj vi el??ipi??as.$D");
			primitives.PC_Points(3);
			primitives.PC_SetCurrentLoc (primitives.IT_X("loc_nova_insulo"));
			return true; // done
		}
	});

	items.push ({
		id: 'nprimitives.PC_forta_pirato',
		strike: function() {
			if (par_c.item2 == primitives.IT_X('obj_ligna_bastono')) {
				primitives.CA_ShowMsg("Vi batas per la $P$D. Estas trafo!$D Vi trafis la piraton ghuste al la tempio.$D Li falas teren kaj morti??as.");
				primitives.IT_SetLocToLimbo(this.index);
				primitives.IT_ReplacedBy (this.index, primitives.IT_X("obj_morta_pirato"));
				return true; // done
			}
			return false; // nothing done in item scope
		}
	});

}

// external functions: called by LUDI environment
function statusArray () {

	var energy = primitives.IT_GetAttPropValue (primitives.PC_X(), "hasEnergy", "energy");
	return [
		{id:"energio",value:energy }
	];
}

function turn (indexItem) {

	var  primitives = this.primitives // tricky

	if (indexItem == primitives.PC_X()) {
		// PC losses energy each time
		primitives.IT_IncrAttPropValue (primitives.PC_X(), "hasEnergy", "energy", -1);
		if (primitives.IT_GetAttPropValue (primitives.PC_X(), "hasEnergy", "energy") <0 ) {
			primitives.CA_ShowMsg("Vi mortas pro laceco"); // LUDIa aldonajxo
			primitives.CA_EndGame ();
		}
		return true;
	}

	if (primitives.IT_ATT(indexItem, "hasEnergy")) {
		usr.monstruaVico (indexItem);
	}

}

 // internal functions ****************************************************************************************************************


usr.monstruaVico = function (itemIndex) {

	var  primitives = this.primitives // tricky

	var agreso = primitives.IT_GetAttPropValue (itemIndex, "hasEnergy", "agreso");
		var atako = primitives.IT_GetAttPropValue (itemIndex, "hasEnergy", "atako");
		var protekto = primitives.IT_GetAttPropValue (itemIndex, "hasEnergy", "protekto");

	var manghemo = primitives.IT_GetAttPropValue (itemIndex, "hasEnergy", "manghemo");
	var trinkemo = primitives.IT_GetAttPropValue (itemIndex, "hasEnergy", "trinkemo");
	var vagemo = primitives.IT_GetAttPropValue (itemIndex, "hasEnergy", "vagemo");

	// here!!
	agreso = 0; vagemo=1;

	if (agreso > 0) {
		// se uloj cxi tie
		if (primitives.PC_GetCurrentLoc() == primitives.IT_GetLoc (itemIndex)) {
			usr.combat (itemIndex, primitives.PC_X(), -1);
			return true;
		}
	}

	if (manghemo > 0) {
		// se mangxajxo cxi tie
		//if () {

		//	return true;
		// }
	}

	if (trinkemo > 0) {
		// se drinkajxo cxi tie
		//if () {

		//	return true;
		// }
	}

	if (vagemo > 0) {
		var randomLoc = primitives.IT_GetRandomDirectionFromLoc (primitives.IT_GetLoc(itemIndex));
		if (randomLoc != null) {
			var previousLoc = primitives.IT_GetLoc (itemIndex);

			if (primitives.PC_GetCurrentLoc() == previousLoc) {
				// show moving out
				primitives.CA_ShowMsg("%o1 moves to %o2 ", [itemIndex, randomLoc.target]); // to-do: ("%o1, moves to d1", itemIndex, randomLoc.dir);
			}

			primitives.IT_SetLoc (itemIndex, randomLoc.target);

			// console.log ("NPC " + ludi_runner.world.items[itemIndex].id + " nun je " + ludi_runner.world.items[randomLoc.target].id);

			if (primitives.PC_GetCurrentLoc() == randomLoc.target) {
				primitives.CA_ShowMsg("%o1 comes here from %o2 ", [itemIndex, randomLoc.target]); // to-do: ("%o1, moves to d1", itemIndex, randomLoc.dir);
				// show moving in
			}

			return true;
		}
	}


}

// komuna kodo por mangxi kaj trinki
usr.reactionManghi_Trinki = function (actionId, libIndex, par_c, fromDown) { // interna

	var  primitives = this.primitives // tricky

	var attId;

	if (actionId == "drink") attId = "isDrinkAble";
	else if (actionId == "eat") attId = "isEatAble";
	else return false;

	fromDown = (fromDown === true);
	// save current loc
	var oldLoc = primitives.IT_GetLoc (par_c.item1);

	// energy to PC
	var energy = primitives.IT_GetAttPropValue (par_c.item1, attId, "energy");

	// default lib reaction: item is destroyed

	ludi_lib.reactions[libIndex].reaction(par_c, fromDown);


	// poison?
	if (primitives.IT_AttPropExists(par_c.item1, attId, "poison")) {
		var poison = primitives.IT_GetAttPropValue (par_c.item1, attId, "poison");
		// LUDIa aldonajxo:
		primitives.CA_ShowMsg ("Venena");
		primitives.CA_ShowMsg ("Vi perdas energion");
		primitives.IT_IncrAttPropValue (primitives.PC_X(), "hasEnergy", "energy", -energy);
	} else {
		primitives.CA_ShowMsg ("Vi gajnis energion");
		primitives.IT_IncrAttPropValue (primitives.PC_X(), "hasEnergy", "energy", +energy);
	}

	// then, the new object (if ite exists) is moved to the old loc
	if (primitives.IT_AttPropExists(par_c.item1, attId, "newObj")) {
		var newObjectId = primitives.IT_GetAttPropValue (par_c.item1, attId, "newObj");
		if (typeof newObjectId != 'undefined')
			primitives.IT_SetLoc (primitives.IT_X(newObjectId), oldLoc);
	}
	return true;
}



// complex RPG combat

usr.combat = function (source, target, weapon) {
	var  primitives = this.primitives // tricky

	if (source == primitives.PC_X()) {
		primitives.CA_ShowMsg("Vi atakas %o1", [target]);
	} else {
		primitives.CA_ShowMsg("%o1 atakas vin!", [source]);
	}

	// simple combat: atako - protekto
	var atako = MISC_Random (+primitives.IT_GetAttPropValue (source, "hasEnergy", "atako"));
	var protekto = MISC_Random(+primitives.IT_GetAttPropValue (target, "hasEnergy", "protekto"));
	var vundo = atako - protekto;

	if (vundo>0) {
		primitives.IT_IncrAttPropValue (target, "hasEnergy", "energy", -vundo);
		if (source == primitives.PC_X()) {
			primitives.CA_ShowMsg("Vi vundas %o1.", [target]);
		} else {
			primitives.CA_ShowMsg("%o1 vundas vin!", [source]);
		}
	} else {
		if (source == primitives.PC_X()) {
			primitives.CA_ShowMsg("Vi ne vundas %o1.", [target]);
		} else {
			primitives.CA_ShowMsg("%o1 ne vundas vin!", [source]);
		}
	}

	if (+primitives.IT_GetAttPropValue (target, "hasEnergy", "energy") <0) {
		if (source == primitives.PC_X()) {
			primitives.CA_ShowMsg("Vi mortigas %o1.", [target]);
		} else {
			primitives.CA_ShowMsg("%o1 mortigas vin!", [source]);
			primitives.CA_EndGame ();
			return;
		}
		var newObjectId = primitives.IT_GetAttPropValue (target, "hasEnergy", "newObj");
		primitives.IT_ReplacedBy (target, primitives.IT_X(newObjectId));
	}

}
