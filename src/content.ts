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
  venue: 'Bliss Beauty World',
  street: '9 East 167th Street',
  city: 'Bronx, NY 10452',
  maps: 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('Bliss Beauty World, 9 East 167th Street, Bronx, NY 10452'),
  /** Turn on only after Astou confirms her number is registered on WhatsApp. */
  whatsapp: false,
};

export const whatsappLink = (text: string) => `https://wa.me/17183003011?text=${encodeURIComponent(text)}`;

/* ------------------------------------------------------------------ Categories */

export type CatId = 'nappy' | 'boho' | 'sculptural' | 'braiding' | 'editorial';

export const CATS: Record<CatId, { title: L; short: L; text: L }> = {
  nappy: {
    title: { en: 'Nappy & Natural Texture', fr: 'Nappy & texture naturelle' },
    short: { en: 'Nappy', fr: 'Nappy' },
    text: {
      en: 'Styles that celebrate natural texture as it is: defined, shaped and finished with care, for hair that looks and feels like your own.',
      fr: 'Des coiffures qui célèbrent la texture naturelle telle qu’elle est : définie, mise en forme et finie avec soin, pour des cheveux qui vous ressemblent.',
    },
  },
  boho: {
    title: { en: 'Boho Braids', fr: 'Tresses bohèmes' },
    short: { en: 'Boho', fr: 'Bohème' },
    text: {
      en: 'Braids with soft, free-flowing strands woven through, for an effortless, romantic movement that stays elegant from day to night.',
      fr: 'Des tresses traversées de mèches libres et souples, pour un mouvement naturel et romantique qui reste élégant du matin au soir.',
    },
  },
  sculptural: {
    title: { en: 'Sculptural Braided Updos', fr: 'Chignons tressés sculpturaux' },
    short: { en: 'Sculptural', fr: 'Sculptural' },
    text: {
      en: 'Braids built into volume and line: crowns, rolls, loops and knots, designed from every angle like a piece of sculpture.',
      fr: 'Des tresses construites en volume et en lignes : couronnes, rouleaux, boucles et nœuds, pensés sous tous les angles comme une sculpture.',
    },
  },
  braiding: {
    title: { en: 'Custom Braiding', fr: 'Tresses sur mesure' },
    short: { en: 'Braiding', fr: 'Tresses' },
    text: {
      en: 'Cornrows, feed-ins, box braids and patterned parts, drawn for your face, your hair and the way you live.',
      fr: 'Nattes collées, feed-in, box braids et raies dessinées, pensées pour votre visage, vos cheveux et votre quotidien.',
    },
  },
  editorial: {
    title: { en: 'Editorial & Special Occasion', fr: 'Éditorial & grandes occasions' },
    short: { en: 'Editorial', fr: 'Éditorial' },
    text: {
      en: 'Statement hair for weddings, celebrations, photo shoots and stage: polished, architectural and made to be remembered.',
      fr: 'Des coiffures fortes pour les mariages, fêtes, séances photo et scènes : nettes, architecturales et faites pour marquer.',
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
  kind: 'client' | 'study';
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
    { en: 'Black sculpture', fr: 'Sculpture noire' },
    {
      en: 'Mannequin study: jet-black hair sculpted into large glossy rolls that rise above a sleek front hairline.',
      fr: 'Étude sur tête d’exposition : cheveux noir de jais sculptés en grands rouleaux brillants au-dessus d’une ligne frontale lisse.',
    },
    '50% 30%',
  ),
  P(
    'astou_07_client_sculpted_braided_updo_front',
    'client',
    ['sculptural', 'editorial'],
    { en: 'Braided crown', fr: 'Couronne tressée' },
    {
      en: 'Client wearing a high sculpted updo of thick twisted braids, with neat cornrows leading up from the hairline.',
      fr: 'Cliente portant un chignon haut et sculpté de grosses tresses torsadées, avec des nattes collées nettes depuis la ligne frontale.',
    },
    '50% 25%',
  ),
  P(
    'astou_15_mannequin_sculpted_back_loops_blue_garment',
    'study',
    ['sculptural', 'editorial'],
    { en: 'Loops in blue', fr: 'Boucles en bleu' },
    {
      en: 'Mannequin study, back view: fishbone braids flowing down the head into a bun of looped braids, above a royal-blue garment.',
      fr: 'Étude sur tête d’exposition, vue de dos : tresses en arête de poisson qui descendent vers un chignon de boucles tressées, au-dessus d’un vêtement bleu roi.',
    },
    '50% 40%',
  ),
  P(
    'astou_08_client_long_box_braids_portrait',
    'client',
    ['braiding'],
    { en: 'Long braids, drawn parts', fr: 'Longues tresses, raies dessinées' },
    {
      en: 'Client with long box braids and curved cornrows at the front, finished with sculpted baby hair.',
      fr: 'Cliente avec de longues box braids et des nattes collées courbes sur le devant, finies par des baby hair sculptés.',
    },
    '50% 20%',
  ),
  P(
    'astou_03_grid_sculpted_looped_back',
    'study',
    ['sculptural'],
    { en: 'Woven loops', fr: 'Boucles tissées' },
    {
      en: 'Mannequin study, back view: thick fishbone braids wrapped into overlapping loops.',
      fr: 'Étude sur tête d’exposition, vue de dos : épaisses tresses en arête de poisson enroulées en boucles superposées.',
    },
  ),
  P(
    'astou_09_client_side_braids_white_top',
    'client',
    ['braiding'],
    { en: 'Feed-in cornrows', fr: 'Nattes feed-in' },
    {
      en: 'Client in profile with straight-back feed-in cornrows flowing into long braids.',
      fr: 'Cliente de profil avec des nattes feed-in plaquées vers l’arrière qui se prolongent en longues tresses.',
    },
    '50% 25%',
  ),
  P(
    'astou_12_mannequin_blonde_low_knot',
    'study',
    ['editorial'],
    { en: 'Platinum knot', fr: 'Nœud platine' },
    {
      en: 'Mannequin study: smooth platinum hair gathered into a large woven low knot, held under a fine net.',
      fr: 'Étude sur tête d’exposition : cheveux platine lissés et réunis en un grand nœud bas tressé, maintenu sous une résille fine.',
    },
  ),
  P(
    'astou_02_grid_cornrow_updo_topview',
    'study',
    ['sculptural'],
    { en: 'The pattern from above', fr: 'Le motif vu d’en haut' },
    {
      en: 'Mannequin study seen from above: fishbone braids meeting in a V-shaped parting and rising into an updo.',
      fr: 'Étude sur tête d’exposition vue d’en haut : tresses en arête de poisson qui se rejoignent en V et montent en chignon.',
    },
  ),
  P(
    'astou_10_client_braids_yellow_top',
    'client',
    ['braiding'],
    { en: 'Triangle parts', fr: 'Raies en triangles' },
    {
      en: 'Client with triangle-parted box braids woven with honey-blonde strands.',
      fr: 'Cliente avec des box braids à raies triangulaires, mêlées de mèches blond miel.',
    },
    '50% 25%',
  ),
  P(
    'astou_11_mannequin_black_low_knot',
    'study',
    ['editorial', 'sculptural'],
    { en: 'Low knot', fr: 'Nœud bas' },
    {
      en: 'Mannequin study: sleek black hair swept back into a sculpted low knot at the nape.',
      fr: 'Étude sur tête d’exposition : cheveux noirs lissés vers l’arrière en un nœud bas sculpté sur la nuque.',
    },
  ),
  P(
    'astou_01_grid_sculpted_side_bun',
    'study',
    ['sculptural'],
    { en: 'Side sweep', fr: 'Balayage de côté' },
    {
      en: 'Mannequin study: a smooth side sweep edged with a fishbone braid, leading into a low bun.',
      fr: 'Étude sur tête d’exposition : un balayage lisse sur le côté bordé d’une tresse en arête de poisson, menant à un chignon bas.',
    },
  ),
  P(
    'astou_04_grid_sculpted_roll_updo_front',
    'study',
    ['sculptural'],
    { en: 'Rolled crown', fr: 'Couronne roulée' },
    {
      en: 'Mannequin study: thick fishbone braids coiled into a dense, sculpted crown.',
      fr: 'Étude sur tête d’exposition : épaisses tresses en arête de poisson enroulées en une couronne dense et sculptée.',
    },
  ),
  P(
    'astou_05_grid_blonde_halfup_braid',
    'client',
    ['braiding'],
    { en: 'Silver crown braid', fr: 'Tresse couronne argentée' },
    {
      en: 'Client seen from above: a full Dutch braid crossing silver-blonde hair like a crown.',
      fr: 'Cliente vue d’en haut : une tresse hollandaise qui traverse des cheveux blond argenté comme une couronne.',
    },
  ),
  P(
    'astou_06_grid_side_braided_blonde',
    'client',
    ['braiding'],
    { en: 'Fine side braids', fr: 'Fines tresses de côté' },
    {
      en: 'Client seen from the side: fine braids traced across light brown hair.',
      fr: 'Cliente vue de côté : de fines tresses dessinées sur des cheveux châtain clair.',
    },
  ),
];

export const photo = (id: string) => PHOTOS.find((p) => p.id === id)!;

export const KIND_LABEL: Record<Photo['kind'], L> = {
  client: { en: 'Client', fr: 'Cliente' },
  study: { en: 'Mannequin study', fr: 'Étude sur tête d’exposition' },
};
