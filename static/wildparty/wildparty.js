/*

	About the bilingual game "Wild Party" / "Fiesta Salvaje"

	You can play :
		1) Trough a web html, which uses this javascript code.
		2) Trough command line in your computer using node.js: node wildparty.js [en] (optional parameter "en" for playing in English)

	This is an experimental model to build an interactive fiction work menu based.

	It's a kind of mininal version of the multilingual system kunludi.com, whick is intended for playing cooperative and multilingual interactive non-parsed fiction games.
	
	Thanks to this model, several improvements will be introduced into kunludi.com y even this game will be moved there.
	
	This game is in the jam contest ectocomp 2019 (https://itch.io/jam/ectocomp-2019-espanol and https://itch.io/jam/ectocomp-2019-english ), by Halloween 2019.
	
	The current narrative ellipsis are intended to be expanded in a final game at kunludi.com using locations/items/actions-on-items.
	
	Thank you for playung the game and sorry very much for the bugs and English mistranslations.
	
	Comments are welcome at ludi.ludon@gmail.com
	
	Last modification: october 24, 2019

*/

var lang = "es", state = "init"

var version_html = (typeof window !== 'undefined')

if (!version_html) {
	if (process.argv.length <= 2) {
		console.log ("You can play in English adding the parameter 'en': node wildparty.js en")	
	} else {
		process.argv[2]
		if ((process.argv[2] == "es") || (process.argv[2] == "en")) lang = process.argv[2]
	}
	console.log ("Selected language: " + lang)

}

var modo_debug_state = false
var modo_debug_textos = true
var modo_debug_rabia = false


var kernel = {
	messages: {
		'es': {
			'Lee más': 'Lee más',
			'Pulsa tecla': 'Pulsa tecla',
			'Empieza': 'Empieza',
			'Recomienza partida': 'Recomienza partida',
			'credits': 'Creado por el equipo de <a href="http://www.kunludi.com"  target="_blank">kunludi.com</a>',
			'idioma': 'idioma:',
			'titulo': 'Fiesta Salvaje',
			'contacto': 'Contacto',
			'node': 'Este juego se puede ejecutar, además de a través de esta página, desde línea de comandos con node.js: ',
			'etcocomp2019': 'Participante en el concurso <a href="https://itch.io/jam/ectocomp-2019-espanol"  target="_blank">ectocomp 2019</a>',
			'nota': '<strong>Nota:</strong> en los botones "Lee más" es suficiente que pulses una tecla para proseguir con la lectura.',
			'enlaceabajo': 'Abajo',
			'enlacearriba': 'Arriba',
			'Voz en la oscuridad': 'Voz en la oscuridad',
			
		}, 
		'en': {
			'Lee más': 'Read more',
			'Pulsa tecla': 'Press key',
			'Empieza': 'Start',
			'Recomienza partida': 'Restart a new game',
			'credits': 'Created by the <a href="http://www.kunludi.com"  target="_blank">kunludi.com</a> team',
			'idioma': 'language:',
			'titulo': 'Wild Party',
			'contacto': 'Contact',
			'node': 'You can play this game through this page or throug node.js: ',
			'etcocomp2019': 'This game is in the jam contest <a href="https://itch.io/jam/ectocomp-2019-english"  target="_blank">ectocomp 2019</a>',
			'nota': '<strong>Note:</strong> in the "read more" buttons it is enough pressing a key to keep on reading.',
			'enlaceabajo': 'Bottom',
			'enlacearriba': 'Top',
			'Voz en la oscuridad': 'Voice in the darkness',

		}, 
	},
	getMsg: function (message) {
		if (typeof kernel.messages[lang][message] != 'undefined') {
			return kernel.messages[lang][message]
		} else {
			if (modo_debug_textos) return "[" + message + "]"
			else return message
		}
	},

}

var game = {
	messages: {
		'es': {
			"Introducción 0": "Ana está a oscuras en mitad de la lujosa fiesta de Halloween. Todo había empezado muy bien, pero hace un rato muchos invitados empezaron a pegarse entre sí cada vez con más fuerza. Ana se había movido disimuladamente hasta la puerta de salida de la sala de baile, justo en el momento en que la luz se apagó y todo quedó lleno de oscuridad y gritos... y el desagradable sonido de dientes masticando carne cruda.",
			"Introducción 1": "Buscando refugio, Ana esquiva zarpazos invisibles en la oscuridad, aunque alguno de ellos la despojan de parte de su ropa de bruja del norte. Al final, en el piso de arriba de la mansión, al girar sin esperanzas un pomo más, una puerta se abre.",
			"Introducción 2": "Ana entra y queda cegada un momento por una luz que le cae sobre la cara. Oye cómo se cierra la puerta detrás suya y cuando sus pupilas se adaptan, ve a una mujer con un móvil en la mano, que la mira con los ojos muy abiertos y le susurra desconsoladamente en ruso —Tu nyé Andrey —, y se retira al fondo de la habitación, apagando la luz. Quedan ambas a oscuras.",
			"Introducción 3": "Esperanzada por esta inesperada aliada, Ana comienza a hablar con ella. Quién sabe si juntas podrán sobrevivir a esta pesadilla",
			"entras2_1": "Veo que te aburres de bailar con los zombies",
			"Ana habla por primera vez": "Alardeando de poliglotismo agudo, Ana intenta hablar con la mujer en varios idiomas, pero al no reaccionar ante ellos se resigna a hablar en inglés, idioma al que sí responde.",
			"Finalizar conversación y salir": "sale de la habitación.",
			"menu_erika te presentas": "se presenta.",
			"háblame de ti primero": "Háblame de ti primero, no sé si fiarme.",
			"me gustaría dejarte el móvil": "Me gustaría dejártelo, pero es lo último que me queda de mi novio.",
			"¿Quién eres?": "pregunta —¿quién eres?",
			"soy Erika": "Me llamo Erika. Creía que serías mi novio. Estoy muy preocupada por él.",
			"tres toques": "Si sales, no te olvides de golpear tres veces para saber que eres tú y dejarte entrar.",
			"sales": "Ana sale de la habitación y oye cómo se cierra la puerta desde dentro",
			"Erika no reacciona": "Erika no reacciona y se queda en silencio.",
			"Pregunta por el novio": "pregunta a Erika por su novio.",
			"te presentas 0": "Ana hace un resumen somero de su historia:",
			"te presentas 1": "Esta mañana había llegado a la opulenta mansión de las afueras de San Petersburgo. Le habían invitado unos amigos rusos de la universidad de Helsinki donde está de Erasmus, Yuri y Tanya, hijos de padres ricos pero buena gente.", 
			"te presentas 2": "Al llegar se sintió deslumbrada por el alto nivel de los coches y vestidos de los invitados. Luego, cuando le exigieron que entregara su móvil y que se tomara las pastillas requeridas para acceder a la fiesta de Halloween, no le gustó un pelo. Sin embargo, como había informado a sus amigos y familiares sobre con quiénes iba a estar este tiempo, se sentía medianamente segura. Ya le llegaría el día en que fuera una adulta responsable; aún estaba en edad de hacer tonterías.",
			"te presentas 3": "Ana se tomó una de las pastillas delante del de seguridad, pero se cuidó bien de no hacer lo mismo con el resto de pastillas, que escondió y simuló tragar. Los momentos iniciales de la fiesta empezaron con normalidad, hasta que la gente se empezó a poner agresiva y pelear si motivo, momento que aprovechó para ir a un lugar seguro, justo cuando se apagó la luz.",
			"te presentas 4": "Esquivó como pudo diversos empujones e intentos de ser agarrada. En su desesperación, buscó puertas a oscuras, hasta que encontró esta puerta abierta por la que acaba de entrar.",
			"sobre el novio": "Es este de la foto: Andrey, muy guapo —le muestra a Ana la foto en el móvil—. Me temo que le haya pasado lo peor.",
			"¿Sabes algo de los zombis?": "pregunta sobre los zombis.",
			"zombis": "¿Zombis?, yo los llamo los rabiosos. Si has tomado pastillas como yo, pronto serás como ellos. Pero a mi novio y a mí al menos nos obligaron a tomarlas, no como tú que te las tomaste para divertirte.",
			"zombis2": "Ana reconoce en ese momento que sólo ha tomado una pastilla.",
			"zombis3": "Mmm... tarde o temprano te hará efecto, pero quizás tengas tiempo de ayudarme antes de que te ocurra a ti... o a mí misma. Mantén las distancias conmigo si me empiezo a portar de manera agresiva.",
			"obligada_1":  "Los organizadores de la fiesta. Siempre nos hacen consumir el producto antes de darlo por bueno. Yo y mi novio somos los cocineros del producto.",
			"obligada_2":  "Ana se enfurece al saber que esa mujer es la corresponsable de este horror: ¿Cómo han sido capaces de hacer esto? —gritas enfurecida.",
			"obligada_3":  "Nos engañaron. Nunca habríamos aceptado investigar en desarrollar drogas. El empresario que nos contrató se comprometió a financiar la investigación sobre el cerebro que habíamos iniciado en nuestras tesis doctorales, pero al topar con determinados resultados durante nuestra investigación del cerebro, nos secuestraron y nos obligaron a avanzar en una dirección que no habíamos previsto.",
			"Le das la nota a Erika": "le da la nota a Erika.",
			"Pregunta quién les obligó a tomarse las pastillas": "Pregunta quién les obligó a tomarse las pastillas.",	
			"encerrados": "Encerrados en jaula de oro. Llevamos dos años, viajando por todo el mundo, visitando los lugares más lujosos, pero con hombres con pistola siempre a pocos pasos de nosotros. De remesa en remesa, de fiesta en fiesta.",
			"empresario": "Es un tal, Dima, nuevo rico del gas. Maneras exquisitas, pero sin miramientos si te interpones en su camino.",
			"plan_0": "La idea era aprovechar el desorden durante la fiesta para escapar después de tomarnos el antídoto. Estábamos muy asustados y en mitad de los procesos de fabricación nos hemos dedicado a probar en cobayas variantes tóxicas de la droga. La excusa a los jefes era que queríamos mejorar la fórmula y necesitábamos las cobayas antes de probar la droga con vagabundos y luego con clientes.",
			"plan_1": "Descubrimos una variante de la droga, que los enloquecía al rato de ingerirla y los volvía extremadamente agresivos. Al mismo tiempo, dimos con un bloqueador de esa característica que debía tomarse después de ingerir la droga, antes de que hiciera efecto. El producto es muy inestable y requiere ser fabricado poco antes de su consumo.",
			"plan_2": "Ana, debes conseguir el ingrediente necesario para que prepare el antídoto. Como sabes, está en el bar. Si te atemorizan los rabiosos, tómate un par de pastillas, eso te hará perder el miedo y ya luego te anularé los efectos.",
			"pides_móvil_1": "pide móvil.",
			"pides_móvil_2": "se ofrece a buscar al novio de Erika, pidiéndole el móvil prestado para buscarlo: ¿truco o trato?",
			"nota_1": "—Cariño, después de separarnos me llevaron ante Dima en el bar, para decirme que te matarían si las pastillas daban problemas. En un momento de despiste, pude esconder unas cápsulas adicionales con el ingrediente principal del antídoto en una botella especial, ya te imaginas cuál. Es sólo un plan b porque tengo cápsulas con el antídoto preparado en un cajón del despacho.", 
			"nota_2": "—Después de darme una sobredosis de droga, me golpearon y me han dejado esposado, dejando las llaves de las esposas morbosamente a unos pocos metros de mí. Los oí bromear con la combinación de la puerta del laboratorio antes de irse. Joder, es 1031, qué puta gracia.",
			"nota_3": "—Ha pasado un rato desde lo anterior. Noto como la sangre me hierve, sólo quiero dar patadas y morder. La única posibilidad que veo antes de que no haya marcha atrás es cortarme la mano y tomarme las cápsulas con el antídoto que dejé en el cajón.",
			"nota_4": "—Te quiero.",
			"escena escabrosa 0": "Al salir de la habitación, un rabioso agarra a Ana del pie y le arranca uno de sus zapatos de bruja. Al no llevar calcetines, el pie queda impregnado de un líquido sobre cuyo origen prefiere no preguntarse.",
			"escena escabrosa 1": "Después de moverse sigilosamente, Ana ve una sombra que se parece a uno de sus amigos rusos. No puede evitar soltar un gemido y la sombra mira hacia ella. Efectivamente, es Yuri, o lo era. Sigue vestido de vampiro, pero no es su disfraz lo que asusta. Ahora es sólo un rabioso que corre tras Ana y le arranca la falda de bruja. Afortunadamente Ana da esquinazo a Yuri y escapa por los pelos.",
			"escena escabrosa 2": " ¡No! ¡Esa diablesa no puede ser Tanya! En los cuernos de mentira de su difraz, hay clavadas ahora sendas manos. Tanya camina sonriente, dándose graciosamente la mano alternativamente la mano con una u otra mano de su osamenta.",
			"escena escabrosa 3": "to-do: escena escabrosa 3",
			"escena escabrosa 4": "to-do: escena escabrosa 4",
			"escena escabrosa 5": "to-do: escena escabrosa 5",
			"escena escabrosa 6": "to-do: escena escabrosa 6",
			"El juego acabó": "En esta ocasión Ana no consiguió liberarse de los ataques de los furiosos, que desgarran y devoran sus miembros como si fueran fruta madura.",
			"laboratorio 0": "Erika tiembla y lanza miradas de ira a Ana, quie también está a punto de estallar y lanzarse sobre la primera por lo cabrona que ha sido. Al fin y al cabo, Erika fabricó la malditas pastillas.",
			"laboratorio 1": "Pero así y todo, Ana aún confía en la valía científica de la rusa y salen de la habitación cogidas de la mano, temblando antes el más mínimo ruido. Erika ilumina con el menor brillo posible del móvil el teclado de acceso al laboratorio y entran en un segundo.",
			"laboratorio 2": "Antes de darse apenas cuenta de qué estaba pasando, Erika coge las esposas ensangrentadas y sus llaves, que estaban a la vista encima de la mesa, las abre y ata con ella a Ana al mismo sitio donde estuviera Andrey.",
			"laboratorio 3": "Ana grita y se resiste. No es sólo por frustración, sino por el efecto que las drogas causan sobre ella y que están a punto de dejarla en un estado irreversible de embrutecimiento.",
			"laboratorio 4": "Entonces Erika se pone a cocinar. Sus manos expertas tardan apenas cinco minutos en conseguir el antídoto salvador.",
			"laboratorio 5": "Erika se toma su dosis y luego casi debe obligar a Ana a tragar la suya.",
			"laboratorio 6": "Erika cae rendida y cae al suelo. Abre las ventanas y espera que salga el sol.",
			"En ese caso sí te presto mi móvil.":"En ese caso sí te presto mi móvil. Así de desesperada estoy. De todas formas, no vale para llamar, estamos en una zona aislada en la montaña, como bien sabes. Te lo dejo bloqueado, sólo podrás usarlo como linterna. Estamos en Halloween: hacemos trato. De trucos terroríficos ya estamos sobrados.",
			"Ana la ilumina con el móvil": "Ana la ilumina con el móvil y ve una cara demacrada de tanto llorar. En seguida apaga la luz, pero alcanza a ver que viste una bata blanca de laboratorio.",
			"Ana ilumina con el móvil la nota": "Ana ilumina con el móvil la nota, toda salpicada de sangre. Mientras Erika la lee se interrumpe entre lágrimas y traduce a Ana:",
			"Por favor, intenta entrar al laboratorio": "Por favor, intenta entrar al laboratorio que está un poco más allá en esta misma planta, a ver si puedes encontrar a Andrey. Sin embargo, si la puerta está cerrada lamento decirte que no me sé el código de acceso.",	
			"Que te diviertas en la fiesta": "Que te diviertas en la fiesta",
			"No encuentras nada de importancia": "Vagas a oscuras y no encuentras nada de importancia.",
			"Vuelves sobre tus pasos a la habitación": "Con mucha cautela, Ana vuelve sobre sus pasos a la habitación.",
			"Ana descrubre muerto, nota y labotatorio_1": "En la planta de arriba de la mansión, no muy lejos de la habitación de Erika, Ana tantea una puerta metálica con un teclado de acceso. Ve un rastro de sangre que la lleva a un cuerpo al que le falta la mano derecha. Del muñón cuelgan muchas hebras de sangre y tejido, como si hubiese sido brutalmente arrancado, y un gran charco de sangre lo rodea.",
			"Ana descrubre muerto, nota y labotatorio_2": "Ana reconoce en él a Andrey. Lleva una nota encima, que no entiende porque está escrita en cirílico, pero al menos identifica claramente un número, el 1031. Al probarlo en el teclado de acceso al laboratorio Ana consigue entrar al mismo.",
			"Ana descrubre muerto, nota y labotatorio_3": "En el laboratorio todo está lleno de sangre y hay una mano arrancada al lado de unas esposas encadenadas a un metal anclado en la pared. A poca distancia se ven las que parecen ser las llaves de las esposas. Hay muchas jaulas con cobayas y todos los artilugios químicos habituales, como probetas, pipetas y productos químicos divesos. Todo con anotaciones en ruso.",
			"Ana vuelve al laboratorio y acaba viendo video_1": "Ana vuelve al laboratorio a por las cápsulas del antibiótico, pero tras registrarlo todo no las encuenta.",
			"Ana vuelve al laboratorio y acaba viendo video_2": "De regreso a la habitación, un rabioso la intenta apresar y Ana no tiene otra alternativa que volver a la planta baja, donde encuenta cobijo en una garita de seguridad, que dispone de corriente propia.",
			"Ana vuelve al laboratorio y acaba viendo video_3": "Trasteando los controles de las consolas de seguridad, Ana consigue ver las imágenes del laboratorio mientras Andrey aún estaba vivo. Es todo tal cual él mismo relata en su nota, salvo la fatídica parte final: tras liberarse, se avalanza sobre el cajón y se toma con ansiedad gran cantidad de pastillas. En su estado mental alterado seguramente Andrey no se paró a pensar en su novia y no dejó ninguna pastilla, por eso no hay ninguna en el cajón.",
			"Ana vuelve al laboratorio y acaba viendo video_4": "Antes de salir del laboratorio con un portazo, en el vídeo se ve a Andrey retorcerse de dolor. No es que ese antídoto dé mucha confianza aplicado en personas, pero quizás sea la única alernativa de no acabar como el resto de rabiosos.",
			"Ana se enrabieta y consigue botella_0": "Ana llega a la entrada del bar, pero hay mucho ruido de rabiosos, y no se atreve a entrar en un primer momento.",
			"Ana se enrabieta y consigue botella_1": "Luego recuerda el consejo de Erika sobre tomarte la pastilla si no te atreves a enfrentarte a los rabiosos.",
			"Ana se enrabieta y consigue botella_2": "Ana sigue el consejo pero no nota nada raro después de tomarse las pastillas que aún tenía guardadas, al menos no en los primeros minutos. Luego, Ana empieza a sudar y a sentir desprecio contra sí misma y toda la humanidad: “¿Por qué diablos habré aceptado la invitación de esos memos?, ¿qué se ha creido esa puta de Erika manipulándome de esta manera? Conseguiré el ingrediente, pero en cuanto tenga el antídoto la arrojaré a los rabiosos para que den buena cuenta de ella.”",
			"Ana se enrabieta y consigue botella_3": "En su camino al mostrador de bebidas, se cruzan varios rabiosos, pero ya no le dan miedo. De hecho, parecen asustarse un poco cuando Ana les devuelve la mirada y no tiene problema en tomar la botella del puto lagarto y volver a la habitación.",
			"Esto es muy duro": "Esto es muy duro. Yo no me atrevo a abandonar esta habitación, he visto el efecto en las cobayas y es terrorífico. Por favor, ve y trae las cápsulas de las que habla Andrey en su nota, son unas de color rojo con rayas verdes. Ojalá Andrey las haya podido tomar y esté bien, pero me temo lo peor.",
			"le cuenta a Erika el vídeo que vio": "le cuenta a Erika el vídeo que vio.",
			"se toma una pastilla": "se toma una pastilla.",
			"Ana baila sola_0": "Ana sale corriendo sola de la habitación, dejando atrás a Erika. No confía en esa cocinera de drogas. Mejor que se pudra ella ahí sola en su habitación. Seguro que las pastillas de la botella de lagarto por sí misma son el antídoto.",
			"Ana baila sola_1": "Se encierra en el laboratorio y rompe la botella en un recipiente. Luego, se traga las cápsulas.",
			"Ana baila sola_2": "Al principio le  producen un efecto tranquilizador. Se sienta en una silla y empieza a respirar con tranquilidad. Empieza a sonreir: ¡lo había conseguido! ¡El mundo es maravilloso, hasta los rabiosos son maravillosos!",
			"Ana baila sola_3": "Sale del laboratorio y se entrega a brazos del primer rabioso que encuentra. Él también la abraza, la besa, la muerde y le arranca las vísceras. Pero Ana no se arrepiente de nada, no siente nada, sólo amor universal y agradecimiento por ser correspondida en su último baile de Halloween.",
			"Ana toca a la puerta": "Ana toca a la puerta los tres toques que le indicó Erika. La puerta se abre, es empujada adentro y oye cómo la puerta se cierra.",
			"La droga aumenta su efecto en Ana": "La droga aumenta su efecto en Ana",
			"Efectos droga_1": "Los efectos de la droga empiezan a afectar a Ana, que siente que pierde su buen humor y mira con recelo a Erika.",
			"Efectos droga_2": "La droga hace a Ana perder concentración y paciencia. Deja de ver a Erika como una aliada y la empieza a ver más como una rival y la culpable de todo.",
			"Efectos droga_3": "La tensión entre Ana y Erika está a flor de piel, como buscando la mínima para saltar una encima de la otra.",
			"Efectos droga_4_1": "Ana se lanza sobre Erika y empiezan a luchar. Erika también estaba a puntito de perder los estribos y sólo le faltaba esto.",
			"Efectos droga_4_2": "Se tiran de los pelos y se muerden. Al final, cada una sigue un camino distinto por la mansión.",
			"Efectos droga_4_3": "Aparecerán muertas desmembradas la mañana siguiente cuando llegue la policía a la mansión del horror.",
			"busca laboratorio":"sale en busca del laboratorio.",
			"cuenta a Erika que encontró a Andrey muerto":"cuenta a Erika que encontró a Andrey muerto.",
			"pregunta quién les obligó a tomarse las pastillas":"pregunta quién les obligó a tomarse las pastillas.",
			"pregunta por el empresario":"pregunta por el empresario.",
			"pregunta cuánto tiempo llevan encerrados":"pregunta cuánto tiempo llevan encerrados.",
			"pregunta sobre las pastillas":"pregunta sobre las pastillas.",
			"Pastillas alucinógenas de nueva generación":"Pastillas alucinógenas de nueva generación. Dimos con algunos neuro-estimuladores novedosos, cuyo comportamiento conseguimos estabilizar para proporcionar experiencias agradables de corta duración que no dañaran de manera permanente el cerebro. Lamentablemente, el producto era muy inestable y se tenía que consumir en las 24 horas de generarlo. Eso que podía haber sido una debilidad, fue transformado por el rico empresario que nos contrató en una experiencia selecta para gente de alto standing. En ese momento empezaron las fiestas.",
			"experiencia no tan selecta":"¡Yo sólo he visto gente pegándose y mordiéndose entre sí! ¡Pero míreme!: ¡si estoy llena da arañazos y sangre! ¿Cómo me lo explica?",
			"Al principio las pastillas no causaban ese efecto":"Al principio las pastillas no causaban ese efecto. Las fiestas eran muy exitosas porque daban sensación de felicidad sin efectos secundarios apreciables.",
			"pregunta los detalles del plan":"pregunta los detalles del plan",
			"busca antídoto en laboratorio":"busca antídoto en laboratorio",
			"Ana le cuenta vídeo":"Ana le cuenta a Erika el horrible vídeo que vio en la garita.",
			"Hubiese preferido no saber":"Hubiese preferido no saber tantos detalles- dice Erika mirando a Ana con algo de odio.",
			"Erika cuenta plan b":"Erika se resigna ante la noticia de que no queda antídoto en el laboratorio y le da detalles a Ana del plan b",
			"Debes conseguir antídoto":"Creo que no queda alternativa y tendrás que ir al bar en busca de la botella de lagarto, donde Andrey escondió un ingrediente vital para fabricar el antídoto. Creo que el antídoto que él tomó llevaba demasiado tiempo preparado y por eso no le hizo efecto, pero si lo hago yo creo que podría valernos",
			"va al bar a buscar la botella de lagarto":"va al bar a buscar la botella de lagarto",
			"Ana teme a los rabiosos":"Ana parte al bar pero está lleno de rabiosos y no es capaz de enfrentarse a ellos y desiste.",
			"no tomes pastillas sin motivo":"¿Pero estás loca? Mantén las distancias conmigo, vas a acabar siendo una de ellos.",
			"muestra la botella":"muestra la botella.",
			"¡Estupendo!":"¡Estupendo! Te sigo.",
			"Vámonos de aquí de una vez":"Vámonos de aquí de una vez",
			"pregunta por qué falló el plan": "pregunta por qué falló el plan",
			"Cuenta plan fallido": "Una vez preparadas las pastillas me sacaron del laboratorio antes de que pudiera coger cápsulas del antídoto para mí. Se apagaron las luces y empezaron los gritos y los golpes. Cuando por fin, tocaron la puerta de manera civilizara creí que era él y por eso abrí; no esperaba verte a ti.",
			"Fin": "* * * FIN * * *",
			"Quién sabe si": "Quién sabe qué habría pasado si Ana hubiese compartido la botella con Erika...",
			"va sola al laboratorio": "va sola al laboratorio a hacer el antídoto.",
			"va con Erika al laboratorio": "va con Erika al laboratorio.",
			"Vámonos de aquí de una vez": "Vámonos de aquí de una vez.",
			
			
			
			
		},
		/* semiautomatic steps to quick translation: 
			1) copy game.messages.es section into a game.messages.es json file (and check its syntax)
			2) import game.messages.es into a excel sheet game.messages.xlsx in a tab called "es"
			3) translate sheet game.messages.es.xlsx	 using https://translate.google.com/?tl=en&sl=th&hl=en#view=home&op=docs&sl=es&tl=en 
			4) copy the result (tab dividing the two clolumns) into a game.messages.en.txt
			5) in the game.messages.xlsx import game.messages.en.txt in a new tab "en"
			6) copy the first column of "es" tab and overwrite the first column in the "en" tab.
			7) do C1  = """" &  A1 & """"   & ":  " & """"  & B1 & """"          and propagates the same formula down the col C
			8) TRANSLATE THE MESSAGES in column b (may be upload it in the cloud for collaboration)
			9) copy the column in a game.messages.en.json file. the lines must be separates with "," (\r -> ,\r) and all them into { } 
			10) validate the syntax and copy in the "en" section in this file:
			
		*/
		'en': {
			"Introducción 0":  "Ana is in the dark in the middle of the luxurious Halloween party. It had all started very well, but a while ago many guests began to stick together more and more. Ana had moved stealthily to the exit door of the ballroom, just when the lights went out and everything was filled with darkness and screams ... and the unpleasant sound of teeth chewing raw meat.",
			"Introducción 1":  "Seeking refuge, Ana dodges invisible blows in the dark, although some of them strippes her of some of her witch of the north clothes. In the end, on the top floor of the mansion, when she turnes one more knob without much hope, a door opens.",
			"Introducción 2":  "Ana enters and is blinded for a moment by a light that falls on her face. She hears the door closing behind her and when her pupils adjusted, she sees a woman with a cell phone in her hand, who looks at her with wide eyes and whisperes disconsolately in Russian - Tu nyé Andrey -, then she retires to the back of the room, turning off the light. They are both in the dark.",
			"Introducción 3":  "Becoming hopeful for this unexpected ally, Ana starts talking to her. Who knows if together they can survive this nightmare?",
			"entras2_1":  "I see you get bored of dancing with the zombies.",
			"Ana habla por primera vez":  "Being a confident polyglot, Ana tries to speak with the woman in several languages, but after not receiving a reaction to any of them, she resigns herself to speaking in English, the language to which the woman does respond.",
			"Finalizar conversación y salir":  "leaves the room.",
			"menu_erika te presentas":  "introduces herself.",
			"háblame de ti primero":  "Tell me about yourself first. I don't know if I should trust you.",
			"me gustaría dejarte el móvil":  "I'd like to lend it to you, but it's the last thing I have from my boyfriend.",
			"¿Quién eres?":  "asks 'who are you?'",
			"soy Erika":  "My name is Erika. I thought you would be my boyfriend. I am very worried about him.",
			"tres toques":  "If you go out, don't forget to knock three times so I know it's you and I'll let you in.",
			"sales":  "Ana leaves the room and hears the door locked from inside",
			"Erika no reacciona":  "Erika does not react and remains silent.",
			"Pregunta por el novio":  "asks Erika about her boyfriend.",
			"te presentas 0":  "Ana makes a brief summary of her story:",
			"te presentas 1":  "This morning she reached the opulent mansion on the outskirts of St. Petersburg. She had been invited by Russian friends from the University of Helsinki where she is an Erasmus student. Yuri and Tanya are children of rich parents but good people.",
			"te presentas 2":  "Upon arrival she felt dazzled by the extravagence of the cars and dresses of the guests. Then, when she was required to hand over her cell phone and take the pills required to access the Halloween party, she didn't like at all. However, as she had informed her friends and family about who she would be with this time, she felt fairly safe. The day would come when she was a responsible adult; she was still in the age of taking risks.",
			"te presentas 3":  "Ana took one of the pills in front of the security guard,  but took good care not to do the same with the rest of the pills, which she hid and pretended to swallow. The initial moments of the party began normally, but when people began to get aggressive and fight for no reason, she took the chance to go to a safe place. At that moment the lights went out.",
			"te presentas 4":  "She dodged as she could various thrusts and attempts to be seized. In desperation, she searched for dark doors, until she found this open door through which she had just entered.",
			"sobre el novio":  "This his the photo: Andrey, very handsome - she shows Ana the photo on her mobile. I'm afraid the worst has happened.",
			"¿Sabes algo de los zombis?":  "asks about zombies.",
			"zombis":  "Zombies? I call them, the rabid ones. If you have taken pills, like me, you will soon be like them. But my boyfriend and I were at least forced to take them, not like you who took them for fun.",
			"zombis2":  "Ana recognizes at that time that she has only taken one pill.",
			"zombis3":  "Mmm ... sooner or later it will work, but you may have time to help me before it happens to you ... or to me. Keep a good distance from me if I start behaving aggressively.",
			"obligada_1":  "The organizers of the party. They always make us consume the product before taking it for granted. My boyfriend and I are the producers of the product.",
			"obligada_2":  "Ana is enraged to learn that this woman is responsible for this horror: How have they been able to do this? You are angry.",
			"obligada_3":  "They tricked us. We would never have agreed to do research on developing drugs. The businessman who hired us promised to finance the research on the brain that we had begun in our doctoral thesis, but when we encountered certain results during our brain research, they kidnapped us and forced us to move in a direction we had not anticipated.",
			"Le das la nota a Erika":  "gives Erika the note.",
			"Pregunta quién les obligó a tomarse las pastillas":  "asks who forced them to take the pills.",
			"encerrados":  "Locked in a gold cage. We have been traveling around the world for two years, visiting the most luxurious places, but with men with guns always a few steps away from us. From consignment to consignment, from party to party.",
			"empresario":  "Dima, a newly wealthy from gas. Exquisite manners, but with no mercy if you threaten his plans.",
			"plan_0":  "The idea was to take advantage of the disorder during the party to escape after taking the antidote. We were very scared and in the middle of the manufacturing process we have been testing toxic variants of the drug on guinea pigs. The excuse to the bosses was that we wanted to improve the formula and we needed the guinea pigs before trying the drug on tramps then on clients.",
			"plan_1":  "We discovered a variant of the drug, which drove them crazy after taking it and made them extremely aggressive. At the same time, we found a blocker of that characteristic. It should be taken after ingesting the drug, before it takes effect. The product is very unstable and needs to be manufactured shortly before consumption.",
			"plan_2":  "Ana, you must get the necessary ingredient to prepare the antidote. As you know, it's in the bar. If the rabid ones frighten you, take a couple of pills, that will make you lose your fear and then I will nullify the effects.",
			"pides_móvil_1":  "asks for cell phone.",
			"pides_móvil_2":  "She offers to look for Erika's boyfriend, borrowing her cell phone to look for him: trick or treat?",
			"nota_1":  "Honey, after separating, they took me to Dima in the bar, to tell me that they would kill you if the pills caused problems. In a moment of distraction, I was able to hide some additional capsules with the main ingredient of the antidote in a special bottle, you can imagine which one. It's just a plan B because I have capsules with the antidote prepared in an office drawer.",
			"nota_2":  "After giving me a drug overdose, they beat me and left me in handcuffs, leaving the keys to the handcuffs frustratingly a few metres away from me. I heard them joking about the combination of the lab door before leaving. Fuck, it's 1031, what a fucking humor sense.",
			"nota_3":  "It's been a while since the above. I feel my blood boiling, I just want to kick and bite. The only possibility I see before there is no going back is to cut off my hand and take the capsules with the antidote that I left in the drawer.",
			"nota_4":  "I love you.",
			"escena escabrosa 0":  "Upon leaving the room, a madman grabs Ana's foot and rips one of her witch shoes off. As she's not wearing socks, her foot is soaked in a liquid whose origin she prefers not to know.",
			"escena escabrosa 1":  "After moving quietly, Ana sees a shadow that looks like one of her Russian friends. She can't help letting out a groan and the shadow looks at her. Indeed, it is Yuri, or it was. He is still dressed as a vampire, but it is not his costume that is scary. Now he is just a madman who runs after her and rips off her  witch skirt. Fortunately Ana gives Yuri the slip and makes a lucky escape.",
			"escena escabrosa 2":  "Do not! That devil can't be Tanya! In the lying horns of his disguise, there are now nailed hands. Tanya walks smiling, shaking hands alternately with one hand or another of her horn.",
			"escena escabrosa 3":  "to-do: rugged scene 3",
			"escena escabrosa 4":  "to-do: rugged scene 4",
			"escena escabrosa 5":  "to-do: rugged scene 5",
			"escena escabrosa 6":  "to-do: rugged scene 6",
			"El juego acabó":  "On this occasion Ana failed to free herself from the attacks of the furious, who tear and devour her limbs as if they were ripe fruit.",
			"laboratorio 0":  "Erika trembles and throws an angry look at Ana, who is also about to explode and throw herself on the former because of what a bitch she has been. After all, Erika made the damn pills.",
			"laboratorio 1":  "But Ana still trusts the scientific judgement of the Russian and they leave the room holding hands, trembling with the slightest noise. Erika illuminates the access key to the laboratory with the lowest possible brightness of her mobile and they enter quickly.",
			"laboratorio 2":  "Before realizing just what was happening Erika takes the bloody handcuffs and  their keys, which were visible on the table, opens them and restrains Ana with them to the same place where Andrey was.",
			"laboratorio 3":  "Ana screams and resists. It is not only because of frustration, but because of the effect the drugs have on her and that they are about to leave her in an irreversible state of low intelligence.",
			"laboratorio 4":  "Then Erika starts cooking. Her expert hands take just five minutes to get the savior antidote.",
			"laboratorio 5":  "Erika takes her dose and then she must almost force Ana to swallow hers.",
			"laboratorio 6":  "Erika falls asleep and falls to the ground. Open the windows and wait for the sun to rise.",
			"En ese caso sí te presto mi móvil.":  "In that case I will lend you my mobile. That's how desperate I am. Anyway, it is not worth calling, we are in an isolated area on the mountain, as you well know. I will leave it locked, you can only use it as a flashlight. It's Halloween: we'll make a deal. We've already had enough of terrifying tricks.",
			"Ana la ilumina con el móvil":  "Ana lights it with her cell phone and sees a face emaciated from so much crying. She immediately turns off the light, but not before she sees a white lab coat.",
			"Ana ilumina con el móvil la nota":  "Ana lights up the note with her cell phone, all dotted with blood. While Erika reads it she bursts into tears and translates to Ana:",
			"Por favor, intenta entrar al laboratorio":  "Please try to enter the laboratory that is a little further on this same floor, to see if you can find Andrey. However, if the door is closed, I'm sorry to tell you that I don't know the access code.",
			"Que te diviertas en la fiesta":  "Have fun at the party",
			"No encuentras nada de importancia":  "You wander in the dark and you don't find anything of importance.",
			"Vuelves sobre tus pasos a la habitación":  "With great caution, Ana retraces her steps to the room.",
			"Ana descrubre muerto, nota y labotatorio_1":  "On the top floor of the mansion, not far from Erika's room, Ana spies a metal door with an access keypad. She sees a trail of blood that leads to a body which lacks the right hand. Many threads of blood and tissue hang from the stump, as if it had been brutally torn away, and a large pool of blood surrounds it.",
			"Ana descrubre muerto, nota y labotatorio_2":  "Ana recognizes that it's Andrey. He has a note on him, which she does not understand because it is written in Cyrillic, but at least it clearly identifies a number, 1031. When she tries it on the keyboard access to the laboratory, Ana manages to enter.",
			"Ana descrubre muerto, nota y labotatorio_3":  "In the laboratory there is blood everywhere and there is a hand torn off next to some handcuffs chained to a metal ring anchored in the wall. Within walking distance are what appear to be the keys to the handcuffs. There are many cages with guinea pigs and all the usual chemical gadgets, such as specimens, pipettes and various chemicals. All with annotations in Russian.",
			"Ana vuelve al laboratorio y acaba viendo video_1":  "Ana returns to the laboratory for the antibiotic capsules, but after searching everything does not find them.",
			"Ana vuelve al laboratorio y acaba viendo video_2":  "Back to the room, a rabid one tries to arrest her and Ana has no alternative but to return to the ground floor, where she has shelter in a security checkpoint, which has its own electricity supply.",
			"Ana vuelve al laboratorio y acaba viendo video_3":  "Manipulating the controls of the security consoles, Ana manages to see the images of the laboratory while Andrey was still alive. It is all as he himself recounts in his note, except for the fateful final part: after freeing himself, he leaps over the drawer and eagerly takes a large number of pills. In his altered mental state, Andrey surely did not stop to think about his girlfriend and left no pills, so there are none in the drawer.",
			"Ana vuelve al laboratorio y acaba viendo video_4":  "Before leaving the laboratory with a slam, the video shows Andrey writhing in pain. This antidote doesn't give confidence applied to people, but perhaps it is the only way of not ending up like the rest of the rabid ones.",
			"Ana se enrabieta y consigue botella_0":  "Ana arrives at the entrance to the bar, but there is a lot of rabid people, and she does not dare to enter at first.",
			"Ana se enrabieta y consigue botella_1":  "Then she remembers Erika's advice about taking the pill if you don't dare to face the rabid ones.",
			"Ana se enrabieta y consigue botella_2":  "Ana follows the advice but does not notice anything strange after taking the pills she still had, at least not in the first few minutes. Then, Ana begins to sweat and feel a contempt against herself and all humanity: 'Why the hell did I accept the invitation of those stupids?What has that whore Erika been believed by manipulating me in this way? I will get the ingredient, but as soon as I have the antidote I will throw her to the rabid ones.",
			"Ana se enrabieta y consigue botella_3":  "On their way to the drinks counter, several rabid ones cross, but she is no longer afraid of them. In fact, they seem to be a little scared when Ana looks back at them, so she has no problem taking the bottle of the fucking lizard and returning to the room",
			"Esto es muy duro":  "This is very hard. I do not dare to leave this room, I have seen the effect on guinea pigs and it is terrifying. Please go and bring the capsules Andrey speaks in his note, they are red with green stripes. I wish Andrey could take them and be well, but I fear the worst.",
			"le cuenta a Erika el vídeo que vio":  "tells Erika the video she saw.",
			"se toma una pastilla":  "takes a pill.",
			"Ana baila sola_0":  "Ana runs out of the room alone, leaving Erika behind. She does not trust the drug cook. Better rot herself there in her room alone. Surely the lizard bottle pills by themselves are the antidote.",
			"Ana baila sola_1":  "It is locked in the laboratory and breaks the bottle in a container. Then, swallow the capsules.",
			"Ana baila sola_2":  "At first they produce a calming effect. She sits in a chair and begins to breathe easy. Start smiling: I had succeeded! The world is wonderful, even the rabid are wonderful!",
			"Ana baila sola_3":  "She leaves the laboratory and gives herself up to the first rabid man she finds. He also hugs her, kisses her, bites her and tears off her viscera. But Ana does not regret anything, feels nothing, only universal love and thanks for being reciprocated in her last Halloween dance.",
			"Ana toca a la puerta":  "Ana knocks on the door the three knocks Erika indicated. The door opens and she hears the door close behind her.",
			"La droga aumenta su efecto en Ana":  "The drug increases its effect on Ana",
			"Efectos droga_1":  "The effects of the drug begin to affect Ana, who feels that she loses her good mood and looks suspiciously at Erika.",
			"Efectos droga_2":  "The drug causes Ana to lose concentration and patience. She stops seeing Erika as an ally and starts seeing her more as a rival and guilty of everything.",
			"Efectos droga_3":  "The tension between Ana and Erika is on the surface as if looking for the minimum to jump on top of each other.",
			"Efectos droga_4_1":  "Ana throws herself on Erika and they start fighting. Erika was also about to lose her temper, so they started fighting.",
			"Efectos droga_4_2":  "They pull their hair and bite. In the end, each one follows a different path through the mansion.",
			"Efectos droga_4_3":  "Their dismembered bodies would appear the next morning when the police arrived at the horror mansion.",
			"busca laboratorio":  "goes out looking for the laboratory.",
			"cuenta a Erika que encontró a Andrey muerto":  "tells Erika that she found Andrey dead.",
			"pregunta quién les obligó a tomarse las pastillas":  "asks who forced them to take the pills",
			"pregunta por el empresario":  "asks about the entrepreneur.",
			"pregunta cuánto tiempo llevan encerrados":  "asks how long they have been locked up.",
			"pregunta sobre las pastillas":  "ask about pills",
			"Pastillas alucinógenas de nueva generación":  "Hallucinogenic tablets of the new generation. We found some innovative neuro-stimulators, whose behavior we managed to stabilize to provide pleasant experiences of short duration that will not permanently damage the brain. Unfortunately, the product was very unstable and had to be consumed within 24 hours of generating it. What could have been a weakness, was transformed by the rich businessman who hired us into a select experience for people of high standing. At that time the parties began.",
			"experiencia no tan selecta":  "I've only seen people sticking and biting each other! But look at me!: I am full of scratches and blood! How can you explain that?",
			"Al principio las pastillas no causaban ese efecto":  "At first, the pills did not cause that effect. The parties were very successful because they gave a feeling of happiness without appreciable side effects.",
			"pregunta los detalles del plan":  "asks about the plan details.",
			"busca antídoto en laboratorio":  "looks for the antidote in laboratory.",
			"Ana le cuenta vídeo":  "Ana tells Erika the horrible video she saw in the checkpoint.",
			"Hubiese preferido no saber":  "I would have preferred not to know so many details- says Erika looking at Ana with some hate.",
			"Erika cuenta plan b":  "Erika is resigned to the news that there is no antidote left in the laboratory and gives Ana details of plan b",
			"Debes conseguir antídoto":  "I think there is no alternative and you will have to go to the bar in search of the lizard bottle, where Andrey hid a vital ingredient to make the antidote. I think that the antidote he took had been prepared for too long and that's why it didn't work, but if I do, I think it could be worth",
			"va al bar a buscar la botella de lagarto":  "goes to the bar to get the lizard bottle.",
			"Ana teme a los rabiosos":  "Ana leaves for the bar but is full of rabid people and is not able to face them, so she gives up.",
			"no tomes pastillas sin motivo":  "But are you crazy? Keep the distances with me, you'll end up being one of them.",
			"muestra la botella":  "shows the bottle.",
			"¡Estupendo!":  "Great! I'll follow you.",
			"Vámonos de aquí de una vez":  "Let's get out of here at once",
			"pregunta por qué falló el plan":  "asks why the plan failed",
			"Cuenta plan fallido":  "Once the pills were prepared, they took me out of the lab before I could take the antidote capsules for me. The lights went out and the screams and blows began. When they finally knocked on the door in a civil way I thought it was him and that's why I opened it. I didn't expect to see you.",
			"Fin": "* * * THE END * * *",
			"Quién sabe si": "Who knows what would have happened if Ana had shared the bottle with Erika ...",
			"va sola al laboratorio": "goes alone to the lab to make the antidote.",
			"va con Erika al laboratorio": "goes with  Erika to the lab.",
			"Vámonos de aquí de una vez": "Let's get out of here at once.",
			
		}

		
	},
	init: function () {
		this.turns = 0
		this.juegoAcabado = false
		this.state = {
			pastillas: 3,
			efectoMultiplicador: 3, //porque Ana se tomó una pastilla al entrar a la fiesta
			rabia:0,
			escenaEscabrosas:0, // cada vez que sales
		}
	},
	usr: {
		mostrarEscenaEscabrosa: function () {
			diagLib.showMsg ("escena escabrosa " + game.state.escenaEscabrosas)
			diagLib.showNL()
			diagLib.showNL()
			game.state.escenaEscabrosas ++
			if (game.state.escenaEscabrosas == 6) {
				// to-do: considerar que si salieron ana y Erika, los rabiosos se las comen a las dos.
				diagLib.showMsg ("El juego acabó")
				diagLib.endGame()
			}
		}
		
	},
}


var dialogo = {

	init: function () {
		this.menu = []
		this.state = {
			primeraVez: true,
			nombreVoz: kernel.getMsg ("Voz en la oscuridad"),
			escena: 0
		}
	},

	reaction: function (option, presskeyCounter) {
		
		if (typeof presskeyCounter == 'undefined') presskeyCounter = 0

		// mensajes antes de la ejecución de la reacción
		if (presskeyCounter == 0) {

			game.state.rabia += game.state.efectoMultiplicador
			if (modo_debug_rabia) {
				diagLib.showAsIs ("Rabia: " + game.state.rabia)
				diagLib.showNL ()				
			}
			
			// mensajes antes de la ejecución de la reacción
			if (game.state.rabia > 99) {
				diagLib.showMsg ("Efectos droga_4_1")
				diagLib.showMsg ("Efectos droga_4_2")
				diagLib.showMsg ("Efectos droga_4_3")
				diagLib.showNL ()
				diagLib.endGame()
				return
			} else if (game.state.rabia > 90 && game.state.rabia < 90 + game.state.efectoMultiplicador ) {
				diagLib.showMsg ("La droga aumenta su efecto en Ana", "strong")
				diagLib.showNL ()
				diagLib.showMsg ("Efectos droga_3")
				diagLib.showNL ()
				diagLib.showNL ()
			} else if (game.state.rabia > 75 && game.state.rabia < 75 + game.state.efectoMultiplicador ) {
				diagLib.showMsg ("La droga aumenta su efecto en Ana", "strong")
				diagLib.showNL ()
				diagLib.showMsg ("Efectos droga_2")
				diagLib.showNL ()
				diagLib.showNL ()
			} else if (game.state.rabia > 50 && game.state.rabia < 50 + game.state.efectoMultiplicador ) {
				diagLib.showMsg ("La droga aumenta su efecto en Ana", "strong")
				diagLib.showNL ()
				diagLib.showMsg ("Efectos droga_1")
				diagLib.showNL ()
				diagLib.showNL ()
			}
			
		}

		
		
		if (version_html) { 
			// Echo
			
			if (typeof option != 'undefined' && presskeyCounter == 0) {
				diagLib.showAsIs ("<strong>" + "# Ana " + diagLib.getMsg(dialogo.menu[option].text) + "</strong>")
				// diagLib.showMsg (dialogo.menu[option].text)
				option = dialogo.menu[option].option
				// diagLib.showAsIs ("</strong>")
				diagLib.showNL ()
			} else {
				if (typeof option != 'undefined') {
					diagLib.showNL ()
					diagLib.showAsIs ("---")
					diagLib.showNL ()
				}
			}
		}

		diagLib.pressKey_option = option
		diagLib.pressKey_counter = presskeyCounter
		
		if (presskeyCounter == 0) {
			game.turns++
		}
		
		if (typeof option == 'undefined') {
			// comienzas conversación
			if (this.state.primeraVez) {
				if (presskeyCounter > 0) {
					diagLib.showAsIs ("---")
					diagLib.showNL ()
				}

				diagLib.showMsg ("Introducción " + presskeyCounter)
				diagLib.showNL ()
				
				if (presskeyCounter < 3) {
					
					diagLib.pulsaTecla()
				} else {
					this.state.primeraVez = false
					dialogo.calculeMenu()
					diagLib.showMenu()
				}
			} else { // no usado en esta versión, uso futuro
				diagLib.showQuote (this.state.nombreVoz, "entras2_1")
				//diagLib.showQuote (this.state.nombreVoz, "entras2_" + game.state.escenaEscabrosas)
			}

			return
		}
		
		if (option == 'opt_salir') { // salir
		
			if (presskeyCounter == 0) {
				if (!this.state.quienEsChica) {
					diagLib.showQuote (this.state.nombreVoz, 'soy Erika') 
					this.state.nombreVoz = "Erika"
					this.state.quienEsChica = true
					diagLib.showQuote (this.state.nombreVoz, 'tres toques')
				}
				diagLib.showMsg ("sales")
				diagLib.showQuote (this.state.nombreVoz, 'Que te diviertas en la fiesta')
				diagLib.pulsaTecla()
				
			} else if (presskeyCounter == 1) {
				game.usr.mostrarEscenaEscabrosa()
				if (game.juegoAcabado) return
				diagLib.pulsaTecla()
			} else if (presskeyCounter == 2) {
				diagLib.showMsg ("No encuentras nada de importancia")
				diagLib.pulsaTecla()
			} else {
				if (game.juegoAcabado) return
				
				diagLib.showNL()
				diagLib.showNL()
				diagLib.showMsg ("Vuelves sobre tus pasos a la habitación")
				diagLib.showNL()
				
				diagLib.showMsg("Ana toca a la puerta")

				dialogo.calculeMenu()
				diagLib.showMenu()
				
			}
			
			return
		}
		
		if (!this.state.hasHablado) {
			diagLib.showMsg ("Ana habla por primera vez")
			this.state.hasHablado = true
		}

		if (option == 'opt_tomar_pastilla') { 
			if (game.state.pastillas > 0) {
				game.state.efectoMultiplicador *= 2 // 2, 4, 8 o 16: equivalen a 50 turnos (si no Ana no toma nunca más pastillas en el juego), 25, 12 o 6 turnos (si se toma las tres pastillas nada más empezar el juego)
				game.state.pastillas--
			}
			diagLib.showAsIs ("Ana se toma una pastilla. Le quedan " + game.state.pastillas)
			diagLib.showNL()
			if (this.state.botella_mostrada) {
				diagLib.showQuote (this.state.nombreVoz, 'Quizás te puedan venir bien si flaqueas de valor para enfrentarte a los rabiosos.')
			} else { // may be, never occurs
				// to-do: pero si ya le dijo que lo hiciera, al decirle los planes del plan, no se debería enfadar
				diagLib.showQuote (this.state.nombreVoz, 'no tomes pastillas sin motivo')
			}
			diagLib.showNL()
			
			return
		}

		if (option == 'opt_te_presentas') { 
			diagLib.showMsg ("te presentas " + presskeyCounter)
			if (presskeyCounter < 4) {
				diagLib.pulsaTecla()
			} else {
				this.state.teHasPresentado = true
				dialogo.calculeMenu()
				diagLib.showMenu()
			}
			
			return
		}
		if (option == 'opt_quien') { // quién eres
			diagLib.showQuote (this.state.nombreVoz, 'soy Erika')
			this.state.nombreVoz = "Erika"
			this.state.quienEsChica = true
			diagLib.showQuote (this.state.nombreVoz, 'tres toques')
			return
		}
		if (option == 'opt_móvil_1') {
			if (!this.state.teHasPresentado) {
				diagLib.showQuote (this.state.nombreVoz, 'háblame de ti primero')
			} else {
				diagLib.showQuote (this.state.nombreVoz, 'me gustaría dejarte el móvil')
				diagLib.showQuote (this.state.nombreVoz, 'sobre el novio')
				this.state.quienEsNovio = true
				if (!this.state.quienEsChica) {
					diagLib.showQuote (this.state.nombreVoz, 'soy Erika')
					this.state.nombreVoz = "Erika"
					this.state.quienEsChica = true
					diagLib.showQuote (this.state.nombreVoz, 'tres toques')				
				}
			}
			return
		}
		if (option == 'opt_móvil_2') {
			diagLib.showQuote (this.state.nombreVoz, 'En ese caso sí te presto mi móvil.')
			diagLib.showMsg ('Ana la ilumina con el móvil')
			diagLib.showQuote (this.state.nombreVoz, 'Por favor, intenta entrar al laboratorio')

			game.state.movil = true
			return
		}
		if (option == 'opt_pregunta_novio') { 
			diagLib.showQuote (this.state.nombreVoz, 'sobre el novio')
			this.state.quienEsNovio = true
			return
		}
		
		// ejecución de misión 1: nota y descubrimiento de muerto
		if (option == 'opt_mision_laboratorio_1') { 
			if (presskeyCounter == 0) {
				game.usr.mostrarEscenaEscabrosa()
				if (game.juegoAcabado) return
				diagLib.pulsaTecla()
			} else {
				diagLib.showMsg ("Ana descrubre muerto, nota y labotatorio_" + presskeyCounter)
				if (presskeyCounter < 3) {
					diagLib.pulsaTecla()
				} else {
					game.state.nota = true
					diagLib.showMsg("Ana toca a la puerta")

					// here?
					if (!this.state.zombis) {
						// to-do msg:
						diagLib.showNL()
						diagLib.showNL()
						diagLib.showMsg("Ana ya no puede contener más la pregunta y le pregunta a Erika por los zombis.")

						// código repetido de option == 'opt_zombis'):
						diagLib.showQuote (this.state.nombreVoz, 'zombis')
						diagLib.showMsg ('zombis2')
						diagLib.showQuote (this.state.nombreVoz, 'zombis3')
						this.state.zombis = true
						// fin de código repetido
					}

					
					dialogo.calculeMenu()
					diagLib.showMenu()
				}
			}
			return
		}
		
		if (option == 'opt_zombis') { 
			diagLib.showQuote (this.state.nombreVoz, 'zombis')
			diagLib.showMsg ('zombis2')
			diagLib.showQuote (this.state.nombreVoz, 'zombis3')
			this.state.zombis = true
			return
		}
		if (option == 'opt_obligados') {
			diagLib.showQuote (this.state.nombreVoz, 'obligada_1')
			diagLib.showMsg ('obligada_2')	
			diagLib.showQuote (this.state.nombreVoz, 'obligada_3')
			this.state.obligada = true
			return
		}
		if (option == 'opt_encerrados') {
			diagLib.showQuote (this.state.nombreVoz, 'encerrados')
			this.state.encerrados = true
			return
		}
		if (option == 'opt_empresario') {
			diagLib.showQuote (this.state.nombreVoz, 'empresario')
			this.state.empresario = true
			return
		}
		if (option == 'opt_plan') {
			diagLib.showQuote (this.state.nombreVoz, 'plan_' + presskeyCounter)
			if (presskeyCounter < 2) {
				diagLib.pulsaTecla()
			} else {
				this.state.plan = true
				dialogo.calculeMenu()
				diagLib.showMenu()
			}
			return
		}
		if (option == 'opt_video_visto') {
			diagLib.showMsg ('Sales y vuelves después de ver el vídeo de la garita de seguridad')
			game.state.video_visto = true
			return
		}
		if (option == 'opt_dar_nota') {
			
			if (presskeyCounter == 0) {
				diagLib.showMsg ('Ana ilumina con el móvil la nota')
				diagLib.pulsaTecla()
			} else if (presskeyCounter < 5) {
				diagLib.showQuote (this.state.nombreVoz, 'nota_' + presskeyCounter)
				diagLib.pulsaTecla()
			} else {
				diagLib.showQuote (this.state.nombreVoz, 'Esto es muy duro')
				
//				y el camino hasta el bar es muy peligroso. Pero si me traes la botella, por cierto, es una muy exótica, con un lagarto dentro, te seguiré hasta el laboratorio para fabricar el antídoto: sólo lleva unos minutos hacerlo a partir de pastillas tóxicas y el ingrediente básico.')
				
				this.state.nota_entregada = true
				dialogo.calculeMenu()
				diagLib.showMenu()
			}
				
			return
		}
		if (option == 'opt_hablar_de_muerto') {
			diagLib.showMsg ('Ana le cuenta a Erika que ha visto el cuerpo de Andrey, pero le ahorra el sufrimiento de hablarle de la mutilación de su mano.')
			diagLib.showMsg ('Erika se retrae unos minutos en la oscuridad. Luego parece coger fuerzas:')
			diagLib.showQuote (this.state.nombreVoz, 'Creo que necesitamos las pastillas que están en el laboratorio. ¿Puedes ir a por ellas?')
			this.state.muerto_reportado = true
			return
		}
		
		if (option == 'opt_mision_laboratorio_2') {
			
			if (presskeyCounter == 0) {
				game.usr.mostrarEscenaEscabrosa()
				if (game.juegoAcabado) return
				diagLib.pulsaTecla()
			} else {
				diagLib.showMsg ("Ana vuelve al laboratorio y acaba viendo video_" + presskeyCounter)
				if (presskeyCounter < 4) {
					diagLib.pulsaTecla()
				} else {
					game.state.video_visto = true
					diagLib.showMsg("Ana toca a la puerta")
					dialogo.calculeMenu()
					diagLib.showMenu()
				}
			}
			return
		}
		
		if (option == 'opt_contar_video') {
			if (presskeyCounter == 0) {
				diagLib.showMsg ('Ana le cuenta vídeo')
				diagLib.pulsaTecla()
			} else {
				this.state.muerto_reportado = true 
				this.state.video_reportado = true
				diagLib.showQuote (this.state.nombreVoz, 'Hubiese preferido no saber')
				diagLib.showMsg ('Erika cuenta plan b')
				diagLib.showQuote (this.state.nombreVoz, 'Debes conseguir antídoto')
				dialogo.calculeMenu()
				diagLib.showMenu()
			}			
			
			return
		}

		if (option == 'opt_pregunta_pastillas') {
			if (presskeyCounter == 0) {
				diagLib.showQuote (this.state.nombreVoz, 'Pastillas alucinógenas de nueva generación')
				diagLib.pulsaTecla()
			} else {
				diagLib.showQuote ("Ana", 'experiencia no tan selecta')
				diagLib.showQuote (this.state.nombreVoz, 'Al principio las pastillas no causaban ese efecto')
				this.state.resultados = true
				dialogo.calculeMenu()
				diagLib.showMenu()
			}
			return
		}
		if (option == 'opt_aterrorizados') {
			diagLib.showQuote (this.state.nombreVoz, 'El capo, Dima, nos encargó una fabricación masiva para una fiesta de Halloween y nos dijo que "¡Pronto os vais a poder jubilar e iros de luna de miel, cocineros!". Algo en su mirada nos hizo entender esa frase más como una amenaza de muerte que una promesa de premio. Cuando, además, nos dijo que iban a poner cámaras grabando todo el proceso de fabricación, tramamos el plan de envenenar las píldoras y reservarnos el antídoto.')
			this.state.aterrorizados = true
			return
		}
		if (option == 'opt_plan_fallido') {
			diagLib.showQuote (this.state.nombreVoz, 'Cuenta plan fallido')
			this.state.plan_fallido = true
			return
		}
		
		if (option == 'opt_mision_bar') {
			if (game.state.rabia < 55) {
				diagLib.showMsg ("Ana teme a los rabiosos")
				return 
			}
			
			diagLib.showMsg ("Ana se enrabieta y consigue botella_" + presskeyCounter)
			if (presskeyCounter < 3) {
				diagLib.pulsaTecla()
			} else {
				game.state.tienes_botella = true
				dialogo.calculeMenu()
				diagLib.showMenu()
			}
			return
		}

		if (option == 'opt_mision_laboratorio_sola') {
			if (presskeyCounter <= 3) {
				diagLib.showMsg ("Ana baila sola_" + presskeyCounter)
				diagLib.pulsaTecla()
			} else if (presskeyCounter == 4 ) {
				diagLib.showNL ()
				diagLib.showMsg ("Fin")
				diagLib.showNL ()
				diagLib.showMsg ("Quién sabe si", "strong")
				diagLib.pulsaTecla()
			} else if (presskeyCounter <=11 ) {
				diagLib.showMsg ("laboratorio " + (presskeyCounter-5) )
				diagLib.pulsaTecla()
			} else {
				diagLib.endGame()
			}
			
			return
		}

		if (option == 'opt_mostrar_botella') {
			diagLib.showQuote (this.state.nombreVoz, '¡Estupendo!')
			this.state.botella_mostrada = true
			
			return
		}
		
		if (option == 'opt_mision_laboratorio_juntas') {

			if (presskeyCounter == 0) {
				diagLib.showQuote (this.state.nombreVoz, 'Vámonos de aquí de una vez')		
				diagLib.showMsg ("laboratorio 0")
				diagLib.pulsaTecla()
			} else if (presskeyCounter <= 6) {
				diagLib.showMsg ("laboratorio " + presskeyCounter)
				diagLib.pulsaTecla()
			} else {
				diagLib.endGame()
			}			
			
			return
		}
		

		diagLib.showMsg ("Erika no reacciona y se mantiene callada.")
	},


	calculeMenu: function () {
		// sirve para decidir qué entradas de menú se habilitan en función del estado interno de la conversación y del juego en general
		this.menu = []

		this.menu.push ({option:'opt_salir', text:"Finalizar conversación y salir"})

		if (!this.state.teHasPresentado) {
			this.menu.push ({option:'opt_te_presentas', text:"menu_erika te presentas"})
		}
		if (!this.state.quienEsChica) {
			this.menu.push ({option:'opt_quien', text:"¿Quién eres?"})
		}
		if (this.state.quienEsChica && !this.state.quienEsNovio) {
			this.menu.push ({option:'opt_pregunta_novio', text:"Pregunta por el novio"})
		}
		if (!game.state.movil) {
			if (!this.state.quienEsNovio || !this.state.teHasPresentado) {
				this.menu.push ({option:'opt_móvil_1', text:"pides_móvil_1"})
			} else {
				this.menu.push ({option:'opt_móvil_2', text:"pides_móvil_2"})
			}
		}
		
		// condiciones para pasar a escena2 (infos aparte)
		if (!game.state.movil || !this.state.teHasPresentado || !this.state.quienEsChica) {
			return
		}
		
		if (!game.state.nota) {
			this.menu.push ({option:'opt_mision_laboratorio_1', text:"busca laboratorio"})
		}
		if (game.state.nota && !this.state.nota_entregada) {
			this.menu.push ({option:'opt_dar_nota', text:"Le das la nota a Erika"})
		}		
		if (!this.state.zombis) {
			this.menu.push ({option:'opt_zombis', text:"¿Sabes algo de los zombis?"})
		}
		// zombies (info 2) -> preguntar_pastillas (info 7+8)
		if (this.state.zombis && !this.state.resultados) {
			this.menu.push ({option:'opt_pregunta_pastillas', text:"pregunta sobre las pastillas"}) 

		}
		
		if (this.state.nota_entregada && this.state.resultados && !game.state.video_visto) {
			this.menu.push ({option:'opt_mision_laboratorio_2', text:"busca antídoto en laboratorio"})
		}
		
		if (this.state.nota_entregada && !this.state.obligada) {
			this.menu.push ({option:'opt_obligados', text:"pregunta quién les obligó a tomarse las pastillas"})
		}

		if (this.state.nota_entregada && !this.state.muerto_reportado && !game.state.video_visto) {
			this.menu.push ({option:'opt_hablar_de_muerto', text:"cuenta a Erika que encontró a Andrey muerto"})
		}
		
		// una vez muerto visto, se habilita tramo de preguntas sobre el empresario y el secuestro, cobayas y antídoto
		// después de esas preguntas vendrá el consejo de Erika, sobre tomar pastillas para afrontar miedo con rabiosos, lo que habilita poder ir al bar a por la botella
		//  : "Si te ataca el miedo, tómate unas pastillas y corre a por la botella; ya tendremos tiempo luego de rebajarte el efecto de la droga."
		
		if (game.state.muerto_reportado && game.state.video_visto && !this.state.obligada) {
			this.menu.push ({option:'opt_obligados', text:"pregunta quién les obligó a tomarse las pastillas"})
		}
		
		if (game.state.video_visto && !this.state.video_reportado) {
			this.menu.push ({option:'opt_contar_video', text:"le cuenta a Erika el vídeo que vio"})
		}
	
		if (this.state.obligada && !this.state.encerrados) {
			this.menu.push ({option:'opt_encerrados', text:"pregunta cuánto tiempo llevan encerrados"})
		}
		if (this.state.obligada && !this.state.empresario) {
			this.menu.push ({option:'opt_empresario', text:"pregunta por el empresario"})
		}
		if (this.state.encerrados && this.state.video_reportado && !this.state.plan) {
			this.menu.push ({option:'opt_plan', text:"pregunta los detalles del plan"})
		}
		
		if (this.state.plan && game.state.pastillas>0) {
			this.menu.push ({option:'opt_tomar_pastilla', text:"se toma una pastilla"})
		}
		
		if (!game.state.tienes_botella && this.state.video_reportado) {
			this.menu.push ({option:'opt_mision_bar', text:"va al bar a buscar la botella de lagarto"})
		}
		
		if (game.state.tienes_botella) {
			if (!this.state.botella_mostrada) {
				this.menu.push ({option:'opt_mostrar_botella', text:"muestra la botella"})
				this.menu.push ({option:'opt_mision_laboratorio_sola', text:"va sola al laboratorio"})
			} else {
				this.menu.push ({option:'opt_mision_laboratorio_juntas', text:"va con Erika al laboratorio"})
			}
		}
		if (this.state.experiencias && !this.state.aterrorizados) { 
			this.menu.push ({option:'opt_aterrorizados', text:"¿Los iban a matar?"})
		}
		if (this.state.aterrorizados && !this.state.plan_fallido) {
			this.menu.push ({option:'opt_plan_fallido', text:"pregunta por qué falló el plan"})
		}
		

	},

	getMenu: function () {
		return this.menu
	}


}

var diagLib = {
	
	init: function () {
		this.pressKey = false
		this.pressKey_option = ''
		this.pressKey_counter = 0
	},

	pulsaTecla: function (msg) {
		if (typeof msg == 'undefined') {
			if (version_html) msg = kernel.getMsg ("Lee más")
			else msg = kernel.getMsg ("Pulsa tecla")
		}
		
		if (version_html) {
			document.getElementById("pulsatecla1").innerHTML =  "<button onclick='htmlPulsaTecla()' id='tecla'>" + msg + "</button>"
			document.getElementById("pulsatecla2").innerHTML =  "<button onclick='htmlPulsaTecla()' id='tecla'>" + msg + "</button>"
			document.getElementById("tecla").focus();
		} else {
			this.showNL()
			this.showMsg (msg)
			this.showNL()
		}
		
		this.pressKey = true
	},
	
	endGame: function () {
		game.juegoAcabado = true
		this.showNL()
		this.showMsg ("Fin")
		this.showNL()
		this.showMenu()
	},
	
	showMenu: function () {
		var menuText = "Ana..." // generalmente será "Menú:"
		
		if (game.juegoAcabado) {
			if (version_html) {
				document.getElementById("botones").innerHTML =  ""
				document.getElementById("pulsatecla1").innerHTML = document.getElementById("pulsatecla2").innerHTML =  ""
				return
			}
			process.exit();
		}
		
		if (diagLib.pressKey) {
			if (version_html) {
				document.getElementById("botones").innerHTML =  ""
			}
			return
		}

		if (version_html) {
			document.getElementById("pulsatecla1").innerHTML = document.getElementById("pulsatecla2").innerHTML =  ""
		}
		
		this.showNL()
		var keySeq = 0
		
		if (!version_html)this.showAsIs(game.turns + " - " + menuText )
		else document.getElementById("botones").innerHTML =  menuText
	
		if (modo_debug_state) {
			diagLib.showNL()
			diagLib.showAsIs("Debug (dialog.state): " + JSON.stringify (dialogo.state))
			diagLib.showNL()
			diagLib.showAsIs("Debug (game.state): " + JSON.stringify (game.state))
			diagLib.showNL()
		}
	
		if (version_html) document.getElementById("botones").innerHTML += "<ul>"
	
		for (var d in dialogo.menu) {
			dialogo.menu[d].key = String.fromCharCode(48+(keySeq++))
			if (!version_html) {
				this.showAsIs("\t" + dialogo.menu[d].key + "> " + this.getMsg(dialogo.menu[d].text))
			} else {
				// display: inline-block;margin:0 auto;width:100px;
				document.getElementById("botones").innerHTML +=  "<li><button style='width:100%;text-align: left;' onclick='htmlReaction(" + d + ")'>" + this.getMsg(dialogo.menu[d].text) + "</button></li>"			
			}
		}
		
		if (version_html) {
			document.getElementById("botones").innerHTML +=  "</ul>"
			if (lang == "es")
				document.getElementById("botones").innerHTML +=  "<p>Ana ha tomado " + (game.turns - 1) + " decisiones</p>"
			else
				document.getElementById("botones").innerHTML +=  "<p>Ana has made " + (game.turns - 1) + " decisions</p>"
			
		}
				
	},
	getMsg: function (message) {
		if (typeof game.messages[lang][message] != 'undefined') {
			return game.messages[lang][message] + " "
		} else {
			if (lang != "es") { // in case of a non-spanish message not translated yet
				if (typeof game.messages["es"][message] != 'undefined') {
					return "[es: " + game.messages["es"][message] + "] "
				}
			}
			if (modo_debug_textos) return "[" + message + "]" + " "
			else return message + " "
		}
	},
	showAsIs: function (message) {
	    if (version_html) {
			document.getElementById("reaction").innerHTML += message + " "
		} else {
			console.log (message) + " "
		}
	},
	showNL: function () {
	    if (version_html) {
			document.getElementById("reaction").innerHTML += "<br/>";
		} else {
			console.log ("")
		}
	},
	showMsg: function (message, modifier) {
	    if (version_html) {
			var preMsg = "", postMsg = ""
			if (modifier == "strong") {preMsg = "<strong>", postMsg = "</strong>"}
			document.getElementById("reaction").innerHTML +=  ( preMsg + this.getMsg(message) + postMsg + " ")
		} else {
			console.log (this.getMsg(message)) + " "
		}
	},

	showQuote: function (name, message) {
	    if (version_html) {
			document.getElementById("reaction").innerHTML += '<p><strong>' + name + ':</strong> "' + this.getMsg(message) + '"' + "</p>";
		} else {
			console.log(name + ': "' + this.getMsg(message) + '"')
		}
	}
}

// ref: https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
if (!version_html) {
	const readline = require('readline');
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.on('keypress', (str, key) => {

		if (key.ctrl && key.name === 'c') {
			process.exit();
		}

		if (diagLib.pressKey) {
			diagLib.pressKey = false
			dialogo.reaction (diagLib.pressKey_option, diagLib.pressKey_counter+1)
			return
		}

		var menu = dialogo.getMenu()

		for (var d in menu) {
			if (key.name == menu[d].key) {
				// echo
				diagLib.showNL()
				diagLib.showAsIs("#" + menu[d].key + ": Ana " + diagLib.getMsg(menu[d].text) )
				diagLib.showNL()

				dialogo.reaction(menu[d].option)
				dialogo.calculeMenu()
				diagLib.showMenu()
			}
		}

	});
}


function htmlReaction(d) {
	dialogo.reaction(d);
	dialogo.calculeMenu(); 
	diagLib.showMenu()	
	
	/*
	// scroll down
	//var objDiv = document.getElementById("todo");
	//objDiv.scrollTop = objDiv.scrollHeight;
	
	//$('#scroll').scrollTop(1000000);
	var body = document.body; // Safari
	var html = document.documentElement; // Chrome, Firefox, IE and Opera places the overflow at the <html> level, unless else is specified. Therefore, we use the documentElement property for these browsers
		
	body.scrollTop += 1000;
	html.scrollTop += 1000;
	*/
}
  
function htmlPulsaTecla () {
	if (!diagLib.pressKey) return
	diagLib.pressKey = false
	dialogo.reaction (diagLib.pressKey_option, diagLib.pressKey_counter+1)
	
	//dialogo.calculeMenu()
	//diagLib.showMenu()

}

function htmlStart() {

	document.getElementById("comboLang").value = lang
	if (state == "init") {
		document.getElementById("start").innerHTML = kernel.getMsg ("Recomienza partida")
		document.getElementById("botones").innerHTML = "Menú"
		document.getElementById("pulsatecla1").style.display = "block"
		document.getElementById("pulsatecla2").style.display = "block"
		document.getElementById("enlaceabajo").style.display = "block"
		document.getElementById("enlacearriba").style.display = "block"
		document.getElementById("extra").style.display = "none"
		document.getElementById("idioma").style.display = "none"
		document.getElementById("comboLang").style.display = "none"	
		init()
		document.getElementById("start").innerHTML = kernel.getMsg ("Recomienza partida")
		document.getElementById("reaction").innerHTML = ""
		dialogo.reaction()
		dialogo.calculeMenu()
		diagLib.showMenu()
		state = "running"
		
	} else {
		document.getElementById("start").innerHTML = kernel.getMsg ("Empieza")
		document.getElementById("botones").innerHTML = ""
		document.getElementById("reaction").innerHTML = ""
		document.getElementById("pulsatecla1").style.display = "none"
		document.getElementById("pulsatecla2").style.display = "none"
		document.getElementById("enlaceabajo").style.display = "none"
		document.getElementById("enlacearriba").style.display = "none"
		document.getElementById("extra").style.display = "block"
		document.getElementById("idioma").style.display = "block"
		document.getElementById("comboLang").style.display = "block"
		state = "init"
	}
}

function htmlChangeLang(selectObject) {
	lang = selectObject.value;
	document.getElementById("credits").innerHTML = kernel.getMsg ("credits")
	document.getElementById("idioma").innerHTML = kernel.getMsg ("idioma") 
	document.getElementById("titulo").innerHTML = kernel.getMsg ("titulo")
	document.getElementById("contacto").innerHTML = kernel.getMsg ("contacto")
	document.getElementById("node").innerHTML = kernel.getMsg ("node")
	document.getElementById("etcocomp2019").innerHTML = kernel.getMsg ("etcocomp2019")
	document.getElementById("nota").innerHTML = kernel.getMsg ("nota")
	document.getElementById("enlaceabajo").innerHTML = kernel.getMsg ("enlaceabajo")
	document.getElementById("enlacearriba").innerHTML = kernel.getMsg ("enlacearriba")
	if (state == "init") {
		document.getElementById("start").innerHTML = kernel.getMsg ("Empieza")
		if (lang == "en") {
			document.getElementById("reaction").innerHTML = "<p>Please forgive some mistranslations.</p>"
		} else {
			document.getElementById("reaction").innerHTML = ""
		}
	}
	

}

function init() {
	
	game.init()
	dialogo.init()
	diagLib.init()
	if (version_html) {
		document.getElementById("comboLang").value = lang
		htmlChangeLang (document.getElementById("comboLang"))
		document.getElementById("start").focus();
	}

}

if (!version_html) {
	diagLib.showAsIs ("Ctrl-c para terminar el programa.")
	diagLib.showNL ()
	init()
	dialogo.reaction()
	dialogo.calculeMenu()
	diagLib.showMenu()
}

