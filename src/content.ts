import type { L } from './i18n';
import manifest from './photo-manifest.json';

/* ------------------------------------------------------------------ Business (verified, supplied by Astou) */

export const BIZ = {
  name: 'Astou Style & Boutique',
  owner: 'Astou Touré',
  phoneDisplay: '718-300-3011',
  phoneIntl: '+1 (718) 300-3011',
  tel: 'tel:+17183003011',
  email: 'astoutoure167@gmail.com',
  instagram: 'https://www.instagram.com/astou_toure/',
  instagramHandle: '@astou_toure',
  /** Shown as the salon name. The building's own name is intentionally not displayed (owner's instruction). */
  venue: 'Astou Style & Boutique',
  street: '9 East 167th Street',
  city: 'Bronx, NY 10452',
  maps: 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('9 East 167th Street, Bronx, NY 10452'),
  /** Style partner, supplied in the owner's brief. */
  partner: { name: 'Alima', phoneIntl: '+1 (347) 814-9472', tel: 'tel:+13478149472' },
  /** Turn on only after Astou confirms her number is registered on WhatsApp. */
  whatsapp: false,
};

export const whatsappLink = (text: string) => `https://wa.me/17183003011?text=${encodeURIComponent(text)}`;

/* ------------------------------------------------------------------ Categories */

export type CatId = 'nappy' | 'boho' | 'sculptural' | 'braiding' | 'editorial';

export const CATS: Record<CatId, { title: L; short: L; text: L }> = {
  nappy: {
    title: { en: 'Nappy & Natural Texture', es: 'Nappy y textura natural', fr: 'Nappy & texture naturelle' },
    short: { en: 'Nappy', es: 'Nappy', fr: 'Nappy' },
    text: {
      en: 'Styles that celebrate natural texture as it is: defined, shaped and finished with care, for hair that looks and feels like your own.',
      es: 'Peinados que celebran la textura natural tal como es: definida, moldeada y bien terminada, para un cabello que se ve y se siente tuyo.',
      fr: 'Des coiffures qui célèbrent la texture naturelle telle qu’elle est : définie, mise en forme et finie avec soin, pour des cheveux qui vous ressemblent.',
    },
  },
  boho: {
    title: { en: 'Boho Braids', es: 'Trenzas boho', fr: 'Tresses bohèmes' },
    short: { en: 'Boho', es: 'Boho', fr: 'Bohème' },
    text: {
      en: 'Braids with soft, free-flowing strands woven through, for an effortless, romantic movement that stays elegant from day to night.',
      es: 'Trenzas con mechones sueltos y ondulados entre ellas, para un movimiento natural y romántico que se ve elegante de día y de noche.',
      fr: 'Des tresses traversées de mèches libres et souples, pour un mouvement naturel et romantique qui reste élégant du matin au soir.',
    },
  },
  sculptural: {
    title: { en: 'Sculptural Braided Updos', es: 'Recogidos trenzados esculturales', fr: 'Chignons tressés sculpturaux' },
    short: { en: 'Sculptural', es: 'Escultural', fr: 'Sculptural' },
    text: {
      en: 'Braids built into volume and line: crowns, rolls, loops and knots, designed from every angle like a piece of sculpture.',
      es: 'Trenzas convertidas en volumen y líneas: coronas, rollos, lazos y nudos, pensados desde todos los ángulos como una escultura.',
      fr: 'Des tresses construites en volume et en lignes : couronnes, rouleaux, boucles et nœuds, pensés sous tous les angles comme une sculpture.',
    },
  },
  braiding: {
    title: { en: 'Custom Braiding', es: 'Trenzas a la medida', fr: 'Tresses sur mesure' },
    short: { en: 'Braiding', es: 'Trenzas', fr: 'Tresses' },
    text: {
      en: 'Cornrows, feed-ins, box braids and patterned parts, drawn for your face, your hair and the way you live.',
      es: 'Trenzas pegadas, feed-in, box braids y rayas con diseño, pensadas para tu cara, tu cabello y tu estilo de vida.',
      fr: 'Nattes collées, feed-in, box braids et raies dessinées, pensées pour votre visage, vos cheveux et votre quotidien.',
    },
  },
  editorial: {
    title: { en: 'Editorial & Special Occasion', es: 'Editorial y ocasiones especiales', fr: 'Éditorial & grandes occasions' },
    short: { en: 'Editorial', es: 'Editorial', fr: 'Éditorial' },
    text: {
      en: 'Statement hair for weddings, celebrations, photo shoots and stage: polished, architectural and made to be remembered.',
      es: 'Peinados que dejan huella para bodas, fiestas, sesiones de fotos y escenario: pulidos, arquitectónicos y hechos para recordarse.',
      fr: 'Des coiffures marquantes pour les mariages, les fêtes, les séances photo et la scène : soignées, architecturales, faites pour qu’on s’en souvienne.',
    },
  },
};

/* ------------------------------------------------------------------ Photographs (authentic work, conservatively edited) */

type Manifest = Record<string, { w: number; h: number; widths: number[] }>;
const M = manifest as Manifest;

export type Photo = {
  id: string;
  file: string;
  w: number;
  h: number;
  widths: number[];
  /** Client = worn by a real client. Study = created on a mannequin head. */
  kind: 'client' | 'study' | 'artist' | 'editorial' | 'press';
  cats: CatId[];
  title: L;
  alt: L;
  focus?: string;
};

const P = (file: string, kind: Photo['kind'], cats: CatId[], title: L, alt: L, focus?: string): Photo => ({
  id: file.slice(6, 8),
  file,
  ...M[file],
  kind,
  cats,
  title,
  alt,
  focus,
});

export const PHOTOS: Photo[] = [
  P(
    'astou_13_mannequin_black_editorial_sculpture',
    'study',
    ['editorial', 'sculptural'],
    { en: 'Black sculpture', es: 'Escultura negra', fr: 'Sculpture noire' },
    {
      en: 'Mannequin study: jet-black hair sculpted into large glossy rolls that rise above a sleek front hairline.',
      es: 'Estudio en cabeza de maniquí: cabello negro azabache esculpido en grandes rollos brillantes sobre una línea frontal lisa.',
      fr: 'Étude sur tête d’exposition : cheveux noir de jais sculptés en grands rouleaux brillants au-dessus d’une ligne frontale lisse.',
    },
    '50% 30%',
  ),
  P(
    'astou_07_client_sculpted_braided_updo_front',
    'client',
    ['sculptural', 'editorial'],
    { en: 'Braided crown', es: 'Corona trenzada', fr: 'Couronne tressée' },
    {
      en: 'Client wearing a high sculpted updo of thick twisted braids, with neat cornrows leading up from the hairline.',
      es: 'Clienta con un recogido alto y escultural de trenzas gruesas torcidas, con trenzas pegadas impecables desde la línea frontal.',
      fr: 'Cliente portant un chignon haut et sculpté de grosses tresses torsadées, avec des nattes collées nettes depuis la ligne frontale.',
    },
    '50% 25%',
  ),
  P(
    'astou_15_mannequin_sculpted_back_loops_blue_garment',
    'study',
    ['sculptural', 'editorial'],
    { en: 'Loops in blue', es: 'Lazos en azul', fr: 'Boucles en bleu' },
    {
      en: 'Mannequin study, back view: fishbone braids flowing down the head into a bun of looped braids, above a royal-blue garment.',
      es: 'Estudio en cabeza de maniquí, vista de espalda: trenzas espiga que bajan hasta un moño de trenzas en lazo, sobre una prenda azul rey.',
      fr: 'Étude sur tête d’exposition, vue de dos : tresses en arête de poisson qui descendent vers un chignon de boucles tressées, au-dessus d’un vêtement bleu roi.',
    },
    '50% 40%',
  ),
  P(
    'astou_08_client_long_box_braids_portrait',
    'client',
    ['braiding'],
    { en: 'Long braids, drawn parts', es: 'Trenzas largas, rayas dibujadas', fr: 'Longues tresses, raies dessinées' },
    {
      en: 'Client with long box braids and curved cornrows at the front, finished with sculpted baby hair.',
      es: 'Clienta con box braids largas y trenzas pegadas curvas al frente, terminadas con baby hairs esculpidos.',
      fr: 'Cliente avec de longues box braids et des nattes collées courbes sur le devant, finies par des baby hair sculptés.',
    },
    '50% 20%',
  ),
  P(
    'astou_03_grid_sculpted_looped_back',
    'study',
    ['sculptural'],
    { en: 'Woven loops', es: 'Lazos tejidos', fr: 'Boucles tissées' },
    {
      en: 'Mannequin study, back view: thick fishbone braids wrapped into overlapping loops.',
      es: 'Estudio en cabeza de maniquí, vista de espalda: gruesas trenzas espiga enrolladas en lazos superpuestos.',
      fr: 'Étude sur tête d’exposition, vue de dos : épaisses tresses en arête de poisson enroulées en boucles superposées.',
    },
  ),
  P(
    'astou_09_client_side_braids_white_top',
    'client',
    ['braiding'],
    { en: 'Feed-in cornrows', es: 'Trenzas pegadas feed-in', fr: 'Nattes feed-in' },
    {
      en: 'Client in profile with straight-back feed-in cornrows flowing into long braids.',
      es: 'Clienta de perfil con trenzas pegadas feed-in hacia atrás que se convierten en trenzas largas.',
      fr: 'Cliente de profil avec des nattes feed-in plaquées vers l’arrière qui se prolongent en longues tresses.',
    },
    '50% 25%',
  ),
  P(
    'astou_12_mannequin_blonde_low_knot',
    'study',
    ['editorial'],
    { en: 'Platinum knot', es: 'Nudo platino', fr: 'Nœud platine' },
    {
      en: 'Mannequin study: smooth platinum hair gathered into a large woven low knot, held under a fine net.',
      es: 'Estudio en cabeza de maniquí: cabello platino liso recogido en un gran nudo bajo tejido, sujeto con una redecilla fina.',
      fr: 'Étude sur tête d’exposition : cheveux platine lissés et réunis en un grand nœud bas tressé, maintenu sous une résille fine.',
    },
  ),
  P(
    'astou_02_grid_cornrow_updo_topview',
    'study',
    ['sculptural'],
    { en: 'The pattern from above', es: 'El diseño visto desde arriba', fr: 'Le motif vu d’en haut' },
    {
      en: 'Mannequin study seen from above: fishbone braids meeting in a V-shaped parting and rising into an updo.',
      es: 'Estudio en cabeza de maniquí visto desde arriba: trenzas espiga que se unen en una raya en V y suben a un recogido.',
      fr: 'Étude sur tête d’exposition vue d’en haut : tresses en arête de poisson qui se rejoignent en V et montent en chignon.',
    },
  ),
  P(
    'astou_10_client_braids_yellow_top',
    'client',
    ['braiding'],
    { en: 'Triangle parts', es: 'Rayas en triángulo', fr: 'Raies en triangles' },
    {
      en: 'Client with triangle-parted box braids woven with honey-blonde strands.',
      es: 'Clienta con box braids de rayas triangulares, entretejidas con mechones rubio miel.',
      fr: 'Cliente avec des box braids à raies triangulaires, mêlées de mèches blond miel.',
    },
    '50% 25%',
  ),
  P(
    'astou_11_mannequin_black_low_knot',
    'study',
    ['editorial', 'sculptural'],
    { en: 'Low knot', es: 'Nudo bajo', fr: 'Nœud bas' },
    {
      en: 'Mannequin study: sleek black hair swept back into a sculpted low knot at the nape.',
      es: 'Estudio en cabeza de maniquí: cabello negro liso peinado hacia atrás en un nudo bajo esculpido en la nuca.',
      fr: 'Étude sur tête d’exposition : cheveux noirs lissés vers l’arrière en un nœud bas sculpté sur la nuque.',
    },
  ),
  P(
    'astou_19_mannequin_side_braided_crown_front',
    'study',
    ['sculptural'],
    { en: 'Side sweep', es: 'Barrido lateral', fr: 'Balayage de côté' },
    {
      en: 'Mannequin study, three-quarter view: a smooth side sweep edged with a fishbone braid that circles the head into a low bun.',
      es: 'Estudio en cabeza de maniquí, de tres cuartos: un barrido lateral liso bordeado por una trenza espiga que rodea la cabeza hasta un moño bajo.',
      fr: 'Étude sur tête d’exposition, de trois quarts : un balayage lisse sur le côté, bordé d’une tresse en arête de poisson qui fait le tour de la tête jusqu’à un chignon bas.',
    },
    '50% 40%',
  ),
  P(
    'astou_04_grid_sculpted_roll_updo_front',
    'study',
    ['sculptural'],
    { en: 'Rolled crown', es: 'Corona enrollada', fr: 'Couronne roulée' },
    {
      en: 'Mannequin study: thick fishbone braids coiled into a dense, sculpted crown.',
      es: 'Estudio en cabeza de maniquí: gruesas trenzas espiga enrolladas en una corona densa y escultural.',
      fr: 'Étude sur tête d’exposition : épaisses tresses en arête de poisson enroulées en une couronne dense et sculptée.',
    },
  ),
  P(
    'astou_05_grid_blonde_halfup_braid',
    'client',
    ['braiding'],
    { en: 'Silver crown braid', es: 'Trenza corona plateada', fr: 'Tresse couronne argentée' },
    {
      en: 'Client seen from above: a full Dutch braid crossing silver-blonde hair like a crown.',
      es: 'Clienta vista desde arriba: una trenza holandesa completa que cruza el cabello rubio plateado como una corona.',
      fr: 'Cliente vue d’en haut : une tresse hollandaise qui traverse des cheveux blond argenté comme une couronne.',
    },
  ),
  P(
    'astou_06_grid_side_braided_blonde',
    'client',
    ['braiding'],
    { en: 'Fine side braids', es: 'Trenzas finas de lado', fr: 'Fines tresses de côté' },
    {
      en: 'Client seen from the side: fine braids traced across light brown hair.',
      es: 'Clienta vista de lado: trenzas finas dibujadas sobre cabello castaño claro.',
      fr: 'Cliente vue de côté : de fines tresses dessinées sur des cheveux châtain clair.',
    },
  ),
  P(
    'astou_23_mannequin_cornrow_updo_back',
    'study',
    ['sculptural', 'braiding'],
    { en: 'Cornrows to a coiled bun', es: 'Trenzas pegadas hasta un moño', fr: 'Nattes collées jusqu’au chignon' },
    {
      en: 'Mannequin study, back view: thick fishbone cornrows curving down the head into a low bun of coiled braids.',
      es: 'Estudio en cabeza de maniquí, de espaldas: gruesas trenzas pegadas tipo espiga que bajan en curva hasta un moño bajo de trenzas enrolladas.',
      fr: 'Étude sur tête d’exposition, vue de dos : d’épaisses nattes collées en arête de poisson qui descendent en courbe jusqu’à un chignon bas de tresses enroulées.',
    },
    '50% 40%',
  ),
  P(
    'astou_20_client_rolled_updo_closeup',
    'client',
    ['sculptural', 'editorial'],
    { en: 'Rolled updo', es: 'Recogido de rizos', fr: 'Chignon roulé' },
    {
      en: 'Client in the salon chair: a high updo of glossy rolled curls above a sleek, swooped edge and soft face-framing tendrils.',
      es: 'Clienta en la silla del salón: un recogido alto de rizos brillantes enrollados sobre un borde liso y ondulado, con mechones sueltos que enmarcan la cara.',
      fr: 'Cliente au salon : un chignon haut de boucles roulées et brillantes, au-dessus d’un contour lisse et ondulé, avec des mèches souples autour du visage.',
    },
    '50% 25%',
  ),
  P(
    'astou_21_client_rolled_updo_side',
    'client',
    ['sculptural', 'editorial'],
    { en: 'Rolled updo, side view', es: 'Recogido de rizos, de lado', fr: 'Chignon roulé, de profil' },
    {
      en: 'The same client from the side: the rolled curls gathered high at the crown, with a smooth nape and a swooped edge.',
      es: 'La misma clienta de lado: los rizos enrollados reunidos en lo alto de la coronilla, con la nuca lisa y un borde ondulado.',
      fr: 'La même cliente de profil : les boucles roulées réunies en haut du crâne, la nuque lisse et le contour ondulé.',
    },
    '50% 25%',
  ),
  P(
    'astou_16_mannequin_woven_crown',
    'study',
    ['sculptural'],
    { en: 'Woven crown', es: 'Corona tejida', fr: 'Couronne tissée' },
    {
      en: 'Mannequin study, back view: wide braids woven across the head like a basket, closing into a braided bun at the nape.',
      es: 'Estudio en cabeza de maniquí, de espaldas: trenzas anchas tejidas sobre la cabeza como una canasta, que se cierran en un moño trenzado en la nuca.',
      fr: 'Étude sur tête d’exposition, vue de dos : de larges tresses entrelacées comme une vannerie, qui se referment en chignon tressé sur la nuque.',
    },
    '50% 40%',
  ),
  P(
    'astou_18_mannequin_braided_crown_side',
    'study',
    ['sculptural'],
    { en: 'Braided crown, side view', es: 'Corona trenzada, de lado', fr: 'Couronne tressée, de profil' },
    {
      en: 'Mannequin study from the side: a thick braid sweeping over sleek hair into a large, round bun of woven braids.',
      es: 'Estudio en cabeza de maniquí, de lado: una trenza gruesa que cruza el cabello liso hasta un gran moño redondo de trenzas tejidas.',
      fr: 'Étude sur tête d’exposition, de profil : une épaisse tresse qui traverse des cheveux lissés jusqu’à un grand chignon rond de tresses entrelacées.',
    },
    '50% 50%',
  ),
  P(
    'astou_17_mannequin_sculpted_low_bun',
    'study',
    ['sculptural'],
    { en: 'Sculpted low bun', es: 'Moño bajo esculpido', fr: 'Chignon bas sculpté' },
    {
      en: 'Mannequin study, back view: glossy black hair smoothed down into a low bun of broad, interlaced braids.',
      es: 'Estudio en cabeza de maniquí, de espaldas: cabello negro brillante alisado hacia un moño bajo de trenzas anchas entrelazadas.',
      fr: 'Étude sur tête d’exposition, vue de dos : des cheveux noirs brillants lissés jusqu’à un chignon bas de larges tresses entrelacées.',
    },
    '50% 50%',
  ),
  P(
    'astou_22_mannequin_blonde_cornrow_updo',
    'study',
    ['braiding', 'sculptural'],
    { en: 'Blonde fishbone cornrows', es: 'Trenzas pegadas rubias', fr: 'Nattes collées blondes' },
    {
      en: 'Mannequin study, front view: platinum-blonde fishbone cornrows meeting in a V at the centre of the hairline.',
      es: 'Estudio en cabeza de maniquí, de frente: trenzas pegadas tipo espiga, rubio platino, que se unen en V en el centro de la línea frontal.',
      fr: 'Étude sur tête d’exposition, de face : des nattes collées en arête de poisson, blond platine, qui se rejoignent en V au milieu du front.',
    },
    '50% 30%',
  ),
];

export const photo = (id: string) => PHOTOS.find((p) => p.id === id)!;

/** Astou's own portrait, supplied by her. Shown as taken: resized only, no retouching. */
export const PORTRAIT: Photo = {
  id: 'portrait',
  file: 'astou_portrait',
  ...M['astou_portrait'],
  kind: 'artist',
  cats: [],
  title: { en: 'Astou Touré', es: 'Astou Touré', fr: 'Astou Touré' },
  alt: {
    en: 'Portrait of Astou Touré, hair artist: deep red hair swept back, gold filigree earrings and necklace, white lace top.',
    es: 'Retrato de Astou Touré, artista del cabello: cabello rojo intenso peinado hacia atrás, aretes y collar de filigrana dorada, blusa de encaje blanco.',
    fr: 'Portrait d’Astou Touré, artiste capillaire : cheveux rouge profond tirés en arrière, boucles d’oreilles et collier en filigrane doré, haut en dentelle blanche.',
  },
  focus: '50% 30%',
};

export const KIND_LABEL: Record<Photo['kind'], L> = {
  client: { en: 'Client', es: 'Clienta', fr: 'Cliente' },
  study: { en: 'Mannequin study', es: 'Estudio en maniquí', fr: 'Étude sur tête d’exposition' },
  artist: { en: 'The artist', es: 'La artista', fr: 'L’artiste' },
  editorial: { en: 'Editorial collaboration', es: 'Colaboración editorial', fr: 'Collaboration éditoriale' },
  press: { en: 'Published page', es: 'Página publicada', fr: 'Page publiée' },
};

/* ------------------------------------------------------------------ Editorial work (published collaborations)
   Shown as supplied (resized only). Credits are transcribed exactly as printed.
   The publication name and issue date are NOT stated anywhere: they still need confirming. */

const E = (file: string, kind: Photo['kind'], title: L, alt: L, focus?: string): Photo => ({
  id: file,
  file: 'ed_' + file,
  ...M['ed_' + file],
  kind,
  cats: [],
  title,
  alt,
  focus,
});

/** The credited editorial page: the case study's centrepiece. */
export const ED_FEATURE = E(
  'monochrome_editorial_portrait_and_credits',
  'press',
  { en: 'The credited portrait', es: 'El retrato con créditos', fr: 'Le portrait crédité' },
  {
    en: 'Black-and-white editorial portrait: a model with sleek, sculpted black hair swept up into a high, curved form. Printed credits beneath include “Hair: Astou Touré and Thomas Dunkin at the Wall Group”.',
    es: 'Retrato editorial en blanco y negro: una modelo con el cabello negro liso y esculpido en una forma alta y curva. Los créditos impresos debajo incluyen “Hair: Astou Touré and Thomas Dunkin at the Wall Group”.',
    fr: 'Portrait éditorial en noir et blanc : une mannequin aux cheveux noirs lissés et sculptés en une forme haute et courbe. Les crédits imprimés dessous incluent « Hair: Astou Touré and Thomas Dunkin at the Wall Group ».',
  },
  '50% 30%',
);

/** A second scan of the same page with larger credit text — used only to read the credits, not shown as a separate project. */
export const ED_CREDITS = E(
  'monochrome_editorial_portrait_credits',
  'press',
  { en: 'Printed credits (archive copy)', es: 'Créditos impresos (copia de archivo)', fr: 'Crédits imprimés (copie d’archive)' },
  {
    en: 'Archive copy of the same page, framed to show the printed credit block in full.',
    es: 'Copia de archivo de la misma página, encuadrada para leer completo el bloque de créditos impresos.',
    fr: 'Copie d’archive de la même page, cadrée pour lire en entier le bloc de crédits imprimé.',
  },
);

/** The published article page naming Astou among the collaborators. */
export const ED_PAGE = E(
  'fractal_affinities_magazine_page',
  'press',
  { en: '“Fractal Affinities” — the article page', es: '“Fractal Affinities”: la página del artículo', fr: '« Fractal Affinities » — la page de l’article' },
  {
    en: 'Magazine page titled “Fractal Affinities”. The text explains that the artist Anna Craycroft designed four hairstyles based on scientific diagrams and that, working alongside Shala Monroque, Elle Muliarchyk, Jenke-Ahmed Tailly and Astou Touré, four models were styled accordingly.',
    es: 'Página de revista titulada “Fractal Affinities”. El texto explica que la artista Anna Craycroft diseñó cuatro peinados a partir de diagramas científicos y que, junto a Shala Monroque, Elle Muliarchyk, Jenke-Ahmed Tailly y Astou Touré, cuatro modelos fueron peinadas según esos diseños.',
    fr: 'Page de magazine intitulée « Fractal Affinities ». Le texte explique que l’artiste Anna Craycroft a conçu quatre coiffures à partir de diagrammes scientifiques et qu’aux côtés de Shala Monroque, Elle Muliarchyk, Jenke-Ahmed Tailly et Astou Touré, quatre mannequins ont été coiffées d’après ces dessins.',
  },
  '50% 20%',
);

/** Editorial gallery (order = layout order). */
export const ED_GALLERY: Photo[] = [
  E(
    'golden_afro_editorial_portrait',
    'editorial',
    { en: 'Signature portrait', es: 'Retrato insignia', fr: 'Portrait signature' },
    {
      en: 'Fashion portrait on a saffron background: a model with a full, sculpted natural afro, eyes lowered, hand at her chin.',
      es: 'Retrato de moda sobre fondo azafrán: una modelo con un afro natural amplio y esculpido, ojos bajos, la mano en la barbilla.',
      fr: 'Portrait de mode sur fond safran : une mannequin à l’afro naturel ample et sculpté, yeux baissés, la main au menton.',
    },
    '45% 30%',
  ),
  E(
    'symmetrical_vintage_hair_portrait',
    'editorial',
    { en: 'Experimental symmetry', es: 'Simetría experimental', fr: 'Symétrie expérimentale' },
    {
      en: 'Black-and-white mirrored composition: two sculpted, coiled chignons reflected into a symmetrical, almost graphic form.',
      es: 'Composición en espejo en blanco y negro: dos moños esculpidos y enrollados que se reflejan en una forma simétrica, casi gráfica.',
      fr: 'Composition en miroir, en noir et blanc : deux chignons sculptés et enroulés, reflétés en une forme symétrique presque graphique.',
    },
  ),
  E(
    'retro_color_blocked_editorial_portrait',
    'editorial',
    { en: 'Colour feature', es: 'Reportaje a color', fr: 'Sujet couleur' },
    {
      en: 'Colour-blocked fashion image: a model with voluminous sculpted curls, in a floral-print dress against blue and red.',
      es: 'Imagen de moda en bloques de color: una modelo con rizos esculpidos y voluminosos, con un vestido de flores sobre fondo azul y rojo.',
      fr: 'Image de mode en aplats de couleur : une mannequin aux boucles sculptées et volumineuses, en robe imprimée de fleurs sur fond bleu et rouge.',
    },
    '50% 20%',
  ),
  E(
    'neon_pop_art_face_collage',
    'editorial',
    { en: 'Pop-art collage', es: 'Collage pop art', fr: 'Collage pop art' },
    {
      en: 'Repeating pop-art collage of a face framed by sculpted curls, in neon yellow, green and red.',
      es: 'Collage pop art que repite un rostro enmarcado por rizos esculpidos, en amarillo, verde y rojo neón.',
      fr: 'Collage pop art répétant un visage encadré de boucles sculptées, en jaune, vert et rouge néon.',
    },
  ),
  E(
    'golden_afro_glamour_pose',
    'editorial',
    { en: 'Fashion spread', es: 'Doble página de moda', fr: 'Double page mode' },
    {
      en: 'Fashion image seen from behind: a model with a full, rounded afro in a metallic gold bodysuit, posed against yellow and turquoise.',
      es: 'Imagen de moda de espaldas: una modelo con un afro redondo y amplio, en un body dorado metálico, posando sobre amarillo y turquesa.',
      fr: 'Image de mode vue de dos : une mannequin à l’afro rond et ample, en body doré métallisé, posant sur fond jaune et turquoise.',
    },
    '50% 35%',
  ),
];

/** Credits exactly as printed on the credited page. */
export const ED_CREDIT_LINES: [string, string][] = [
  ['Hair', 'Astou Touré and Thomas Dunkin at the Wall Group'],
  ['Photographer', 'Elle Muliarchyk'],
  ['Creative Director', 'Shala Monroque'],
  ['Art Director', 'Anna Craycroft'],
  ['Stylist', 'Jenke-Ahmed Tailly'],
];

/** Editorial image from the same credited shoot as the “Fractal Affinities” gallery (same model and styling as the pop-art collage). */
export const ED_SCULPTURAL = E(
  'sculptural_beauty_portrait',
  'editorial',
  { en: 'Sculptural beauty', es: 'Belleza escultural', fr: 'Beauté sculpturale' },
  {
    en: 'Fashion portrait in red and blue light: a model with large sculpted rolls of auburn and brown hair, fingertips at her lips.',
    es: 'Retrato de moda con luz roja y azul: una modelo con grandes rollos esculpidos de cabello castaño y caoba, con la punta de los dedos en los labios.',
    fr: 'Portrait de mode en lumière rouge et bleue : une mannequin aux grands rouleaux sculptés de cheveux auburn et châtains, le bout des doigts sur les lèvres.',
  },
  '50% 30%',
);

/* ------------------------------------------------------------------ The art of the finished look (featured collections) */

const LK = (file: string, kind: Photo['kind'], title: L, alt: L, focus?: string): Photo => ({ id: file, file, ...M[file], kind, cats: [], title, alt, focus });

export type Look = { id: string; title: L; text: L; cat: CatId; photos: Photo[]; note?: L };

export const LOOKS: Look[] = [
  {
    id: 'cornrows',
    cat: 'braiding',
    title: { en: 'Precision in every parting', es: 'Precisión en cada raya', fr: 'La précision à chaque raie' },
    text: {
      en: 'Beautifully structured cornrows, designed with clean sections, balanced patterns and elegant length.',
      es: 'Trenzas pegadas bien estructuradas: secciones limpias, un diseño equilibrado y un largo elegante.',
      fr: 'Des nattes collées parfaitement structurées : sections nettes, motif équilibré et longueur élégante.',
    },
    note: { en: 'One client, two views of the same style.', es: 'Una clienta, dos vistas del mismo estilo.', fr: 'Une cliente, deux vues de la même coiffure.' },
    photos: [
      LK('lk_cornrows_front', 'client', { en: 'Curved cornrows — front', es: 'Trenzas pegadas curvas, de frente', fr: 'Nattes collées courbes — de face' }, {
        en: 'Client seated outdoors, head bowed: thick cornrows curving back from the hairline in clean, even sections, falling into long braids.',
        es: 'Clienta sentada al aire libre, con la cabeza inclinada: trenzas pegadas gruesas que se curvan desde la línea frontal en secciones limpias y parejas, y caen en trenzas largas.',
        fr: 'Cliente assise en extérieur, tête penchée : d’épaisses nattes collées qui partent du front en courbes nettes et régulières, puis tombent en longues tresses.',
      }, '50% 30%'),
      LK('lk_cornrows_back', 'client', { en: 'Curved cornrows — back', es: 'Trenzas pegadas curvas, de espaldas', fr: 'Nattes collées courbes — de dos' }, {
        en: 'The same client from behind: the cornrows sweep across the back of the head and fall into long braids finished with small silver cuffs.',
        es: 'La misma clienta de espaldas: las trenzas pegadas recorren la parte de atrás de la cabeza y caen en trenzas largas terminadas con pequeños anillos plateados.',
        fr: 'La même cliente de dos : les nattes collées traversent l’arrière de la tête et tombent en longues tresses terminées par de petits anneaux argentés.',
      }, '50% 30%'),
    ],
  },
  {
    id: 'updo',
    cat: 'sculptural',
    title: { en: 'The art of the updo', es: 'El arte del recogido', fr: 'L’art du chignon' },
    text: {
      en: 'An intricate sculptural updo of carefully set curls, smooth contours and elegant volume, seen from three angles.',
      es: 'Un recogido escultural de rizos colocados con cuidado, contornos lisos y un volumen elegante, visto desde tres ángulos.',
      fr: 'Un chignon sculptural aux boucles soigneusement placées, aux contours lisses et au volume élégant, vu sous trois angles.',
    },
    note: { en: 'Styled on a mannequin head.', es: 'Peinado sobre una cabeza de maniquí.', fr: 'Réalisé sur une tête d’exposition.' },
    photos: [
      LK('lk_updo_front', 'study', { en: 'Sculpted updo — front', es: 'Recogido esculpido, de frente', fr: 'Chignon sculpté — de face' }, {
        en: 'Mannequin study, front view: black hair set in soft sculpted curls framing the face, with a smooth side part.',
        es: 'Estudio en cabeza de maniquí, de frente: cabello negro en rizos suaves y esculpidos que enmarcan la cara, con una raya lateral lisa.',
        fr: 'Étude sur tête d’exposition, de face : cheveux noirs en boucles souples et sculptées autour du visage, avec une raie de côté lisse.',
      }, '50% 30%'),
      LK('lk_updo_back', 'study', { en: 'Sculpted updo — back', es: 'Recogido esculpido, de espaldas', fr: 'Chignon sculpté — de dos' }, {
        en: 'Mannequin study, back view: the curls gathered and pinned into layered rolls at the nape.',
        es: 'Estudio en cabeza de maniquí, de espaldas: los rizos recogidos y sujetos en rollos superpuestos en la nuca.',
        fr: 'Étude sur tête d’exposition, vue de dos : les boucles rassemblées et épinglées en rouleaux superposés sur la nuque.',
      }, '50% 30%'),
      LK('lk_updo_side', 'study', { en: 'Sculpted updo — side', es: 'Recogido esculpido, de lado', fr: 'Chignon sculpté — de profil' }, {
        en: 'Mannequin study in profile: a sleek sweep over the crown flowing into sculpted curls at the back.',
        es: 'Estudio en cabeza de maniquí, de perfil: un barrido liso sobre la coronilla que termina en rizos esculpidos atrás.',
        fr: 'Étude sur tête d’exposition, de profil : un balayage lisse sur le dessus qui se termine en boucles sculptées à l’arrière.',
      }, '50% 30%'),
    ],
  },
  {
    id: 'golden',
    cat: 'braiding',
    title: { en: 'Golden detail', es: 'Detalle dorado', fr: 'Reflets dorés' },
    text: {
      en: 'Long, finely crafted braids with warm highlights, showing precision and movement.',
      es: 'Trenzas largas y finas con reflejos cálidos: precisión y movimiento.',
      fr: 'De longues tresses fines aux reflets chauds, tout en précision et en mouvement.',
    },
    photos: [
      LK('lk_micro_braids', 'client', { en: 'Highlighted micro braids', es: 'Microtrenzas con reflejos', fr: 'Micro-tresses à reflets' }, {
        en: 'Client seen from behind in the salon: very long, fine braids in honey and dark brown tones, falling past the waist.',
        es: 'Clienta de espaldas en el salón: trenzas finas muy largas en tonos miel y castaño oscuro, que pasan de la cintura.',
        fr: 'Cliente de dos au salon : de très longues tresses fines, dans des tons miel et châtain foncé, qui descendent sous la taille.',
      }, '50% 30%'),
    ],
  },
];

/* ------------------------------------------------------------------ Artistry in motion (edited videos supplied by Astou's team)
   The soundtrack is already part of each file (original instrumental replacing the phone audio). Do not add other music. */

export type Clip = { file: string; title: L; dur: string; w: number; h: number };
export type ClipGroup = { id: string; title: L; text: L; clips: Clip[] };

export const CLIP_GROUPS: ClipGroup[] = [
  {
    id: 'braids',
    title: { en: 'Braids & protective styles', es: 'Trenzas y peinados protectores', fr: 'Tresses & coiffures protectrices' },
    text: {
      en: 'Long braids, decorative beads and finished looks, filmed in the salon.',
      es: 'Trenzas largas, cuentas decorativas y estilos terminados, grabados en el salón.',
      fr: 'Longues tresses, perles décoratives et coiffures terminées, filmées au salon.',
    },
    clips: [
      { file: 'braids-honey-salon-reveal', dur: '1:01', w: 512, h: 910, title: { en: 'Long honey-brown braids — the reveal', es: 'Trenzas largas color miel: el resultado', fr: 'Longues tresses miel — la révélation' } },
      { file: 'braids-honey-full-length', dur: '0:13', w: 512, h: 910, title: { en: 'Honey-brown braids, full length', es: 'Trenzas color miel, de largo completo', fr: 'Tresses miel, sur toute la longueur' } },
      { file: 'braids-beaded-360', dur: '0:21', w: 512, h: 910, title: { en: 'Braids with decorative beads, all the way round', es: 'Trenzas con cuentas decorativas, en 360°', fr: 'Tresses ornées de perles, à 360°' } },
      { file: 'braids-long-black-finished', dur: '0:19', w: 512, h: 910, title: { en: 'Long black braids, finished', es: 'Trenzas largas negras, terminadas', fr: 'Longues tresses noires, terminées' } },
    ],
  },
  {
    id: 'updo',
    title: { en: 'A sculptural creation', es: 'Una creación escultural', fr: 'Une création sculpturale' },
    text: {
      en: 'Four moments from the same braided updo, from styling to the finished look. Highlights, not a full step-by-step tutorial.',
      es: 'Cuatro momentos del mismo recogido trenzado, desde el peinado hasta el resultado final. Son momentos destacados, no un tutorial paso a paso.',
      fr: 'Quatre moments du même chignon tressé, de la réalisation au résultat final. Des extraits, pas un tutoriel pas à pas.',
    },
    clips: [
      { file: 'updo-in-progress', dur: '0:09', w: 512, h: 776, title: { en: 'In progress', es: 'Manos a la obra', fr: 'En cours de réalisation' } },
      { file: 'updo-detail', dur: '0:18', w: 512, h: 910, title: { en: 'The braiding, in detail', es: 'El trenzado, de cerca', fr: 'Le tressage, en détail' } },
      { file: 'updo-front-reveal', dur: '0:28', w: 512, h: 910, title: { en: 'Front reveal', es: 'El resultado, de frente', fr: 'Le résultat, de face' } },
      { file: 'updo-side-back', dur: '0:30', w: 512, h: 910, title: { en: 'Side and back', es: 'De lado y de espaldas', fr: 'De profil et de dos' } },
    ],
  },
];

/* ------------------------------------------------------------------ Notable encounters
   Intentionally empty until Astou confirms who is pictured, the circumstances and her role, and supplies the
   original (not AI-reconstructed) photographs. A shared photograph must never read as a collaboration or endorsement.
   The section renders automatically once an entry is added. See APPROVALS.md. */

export type Encounter = { photo: Photo; title: L; caption: L };
export const ENCOUNTERS: Encounter[] = [];
