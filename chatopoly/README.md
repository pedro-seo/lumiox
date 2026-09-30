# Chatopoly

Juego estilo Monopoly con el tablero generado a partir de un chat de grupo de WhatsApp.

Abre `index.html` en el navegador (no necesita servidor ni build).

## Cómo funciona

1. Exporta el chat del grupo desde WhatsApp (**Exportar chat → Sin archivos**). Sirve el `.txt` de Android o el `.zip` de iPhone.
2. Súbelo (o pega el texto). El tablero se genera así:
   - **22 calles**: las palabras más dichas del grupo. Cuanto más se repite, más cara es la calle.
   - **4 estaciones**: los 4 emojis más usados.
   - **Cartas** («Mensaje reenviado» y «Audio del grupo»): frases reales del chat con efectos de juego.
   - **Impuestos**: «Audio de 5 minutos» y «Multa por spam», dedicados a quien más audios manda y a quien más escribe.
3. Edita el nombre de cualquier casilla, elige de 2 a 6 jugadores y a jugar (todos en el mismo dispositivo).

Reglas incluidas: compra, alquiler (×2 con el color completo), casas y hotel, estaciones, servicios, cárcel («Expulsado del grupo»), dobles, cartas, compraventa entre jugadores, venta forzosa de casas y quiebra.

El tablero se puede exportar/importar en `.json` para reutilizarlo o compartirlo sin volver a subir el chat.

## Privacidad

El chat se procesa solo en el navegador. No se envía a ningún servidor. La partida en curso se guarda en `localStorage` del dispositivo.

## Edición Quexinopoly 3D

`quexines/index.html`: tablero fijo en 3D (three.js) construido con el lore del grupo QUEXINES: Villa Jávea, Oficinas de Motorsportive, El Garitaso de NanoCasas, Oficinas de EFS, UADB, la Charca, la Lista de Washed y la Copa TikTok. Fichas con forma de F1, dados 3D y cartas «POLL» y «Audio de NanoCasas» sacadas de frases reales del chat.

Necesita conexión para cargar three.js desde jsDelivr.
