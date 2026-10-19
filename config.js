/* ==========================================================
   EVERYTHING YOU NEED TO EDIT IS IN THIS FILE.
   Put photos in  assets/photos/  videos in  assets/videos/
   and music in  assets/music/ , then change the names below.
   Text marked [placeholder] is sample text - replace it.
   ========================================================== */
window.CONFIG = {
  name: "Gayathri",
  age: 25,
  coverTitle: "Happy 25th Birthday",
  coverName: "Bujjamma",                   // name shown at the bottom of the cover
  coverPhoto: "assets/photos/cover.jpg",   // her photo in the middle of the cover

  backNote: "A book written with full of love, just for you, from your Puchki. \uD83E\uDD79\u2764\uFE0F\uD83D\uDCD6\uD83E\uDEF6\uD83C\uDFFB",   // shown on the back cover

  /* ---------- Date lock ----------
     answers: the accepted answer(s) as text (you can list more than one).
     Set enabled:false to skip the lock.
     NOTE: this is a light lock only - it keeps the book closed for her,
     but anyone who views the page source could read the date. */
  lock: {
    enabled: true,
    question: "First movie watched in theatre?",
    hint: "Hint: Theatre in Jagtial",
    answers: ["Vaazha 2"]   // capitals, spaces and spelling like "Vazha 2" / "Vaazha II" are also accepted
  },

  /* ---------- Music ----------
     default plays on every page unless a page has its own "music". */
  music: {
    default: "assets/music/romantic.mp3",
    volume: 0.08
  },

  /* ---------- The 10 pages ----------
     type: "photo" | "timeline" | "video" | "letter"
     A page can use  photo: "..."  (one photo) or  photos: [...]  (zigzag collage of 3 or 4;
     an item can also be a video:  { video: "x.mp4", poster: "x.jpg" } ).
     Each page = a photo page + a message page. */
  pages: [
    { type: "photo", title: "Where it all began", msgSize: "xxl", date: "The day we met",
      photo: "assets/photos/01.jpg", caption: "The beginning of my forever with you \u221E",
      message: "Ninu photos lo chusi live lo chusina first day you looked so cute bujjama.\nAsalu anukoledhu naku elanti cute ammai tho pellichoopulu jarguthayi ani.\nYou are an angel then now and forever \u2665" },

    { type: "timeline", title: "Our Story So Far \u2764\uFE0F\u2728", date: "",
      photos: ["assets/photos/02a.jpg", "assets/photos/02b.jpg", "assets/photos/02c.jpg"],
      caption: "Our happy journey",
      events: [
        { date: "04 Jan, 2026", text: "The day we met \uD83E\uDEF6\uD83C\uDFFB\uD83D\uDCAB" },
        { date: "27 Feb, 2026", text: "The day I proposed to you and you said yes \u2764\uFE0F\uD83E\uDD79" },
        { date: "17 Mar, 2026", text: "Our first meetup in Hyd \uD83E\uDD0D" },
        { date: "04 Apr, 2026", text: "The day you officially became mine \uD83D\uDC8D\u267E\uFE0F" },
        { date: "Today",        text: "Your 25th Birthday \uD83E\uDD73" }
      ] },

    { type: "photo", title: "The initial phase", msgSize: "xxl", date: "Early days",
      photos: ["assets/photos/03a.jpg", "assets/photos/03b.jpg", "assets/photos/03c.jpg",
               { video: "assets/videos/03.mp4", poster: "assets/photos/03d.jpg" }],   // tap the 4th tile to play the video
      caption: "",
      message: "Niku gurthundha how cute and happy our initial days used to me, nuv nakosam office nunchi ragane kotha varieties chesedanivi (metro lo vacheytapud chusi), we used to talk till late nights and eat midnight icecreams and we had our first fight, first kiss everything was first and cute those days. Luvuu...\uD83D\uDE18" },

    { type: "photo", title: "Our 1st Monthversary\uD83D\uDC8C\uD83D\uDC95", msgSize: "xxl", date: "",
      photos: ["assets/photos/04a.jpg", "assets/photos/04b.jpg", "assets/photos/04c.jpg"],
      caption: "",
      message: "1month of our travel. chala emotions chusam. Nenu blr vellinapud nuv edvatam, night videocalls and nikosam twaraga ravadam subbu ki niku fever ani chepi. Nuv and mummy vallu nakosam karimnagar ki ravadam. Mana 1st monthversary ki na favourite mandi ki veldam and so many. The way you love every version of me is so cute bujjamma \uD83E\uDD70" },

    { type: "photo", title: "Childish side of me", date: "",
      photos: ["assets/photos/05a.jpg", "assets/photos/05b.jpg", { photo: "assets/photos/05c.jpg", tall: true }, "assets/photos/05d.jpg"],
      caption: "Childish side of me",
      // right-hand page: one big video (music drops to 15% while it plays)
      right: { video: "assets/videos/05.mp4", poster: "assets/photos/05v.jpg", volume: 0.05,
               caption: "\uD83C\uDF0E\u2764\uFE0F Life feels more beautiful with you by my side \uD83E\uDEC2\uD83D\uDC96" } },

    { type: "video", title: "Cute Wishes \u2728", date: "Press play, my love",
      video: "assets/videos/06.mp4", photo: "assets/photos/06v.jpg", volume: 0.05,
      caption: "Her Day, Her People \uD83D\uDC51\uD83D\uDC95",
      message: "Nikosam ni bday ki cute and sweet wishes from your friends and family. \uD83C\uDF81\u2764\uFE0F\uD83E\uDEF6\uD83C\uDFFB" },

    { type: "photo", title: "Just us\uD83D\uDC9E", msgSize: "xxl", date: "My happy soul",
      duo: { a: { photo: "assets/photos/07a.jpg", date: "Feb 27, 2026" },
             b: { photo: "assets/photos/07b.jpg", date: "Oct 11, 2026" },
             text: "You & me \uD83D\uDC9E\u2764\uFE0F" },
      caption: "",
      message: "From start to till now, You are always there for me in my good & bad times \uD83E\uDEC2. Nenu low lo unna prathisari you give me confidence. You bring so much warmth, happiness, and positivity into my life just by being around me. Love you, my Kuchupuchu! \u2764\uFE0F\uD83E\uDEF6\uD83C\uDFFB" },

    { type: "photo", title: "My everything \u2764\uFE0F\uD83E\uDDFF", date: "", layout: "p8", tight: true,
      photos: [{ photo: "assets/photos/08a.jpg", ar: "2/3" }, { photo: "assets/photos/08b.jpg", ar: "3/5" }, { photo: "assets/photos/08c.jpg", ar: "4/5" }],
      caption: "",
      message: "Nuv naa life loki vachaka, I\u2019ve learnt so many beautiful things, bujjamma. \u2764\uFE0F\uD83E\uDD79 The way I care for people has changed, my love for my parents has become even more special, my patience has grown, and my love for you is truly endless. \uD83E\uDEF6\uD83C\uDFFB\u2764\uFE0F\nYou\u2019re not just my wife, you\u2019re also my best friend \u2014 the one I can share everything with, just like I do with my closest friends. Thank you for being my comfort, my happiness, and my everything. Love you, bujjamma! \uD83D\uDE18\u2764\uFE0F\uD83E\uDDFF" },

    { type: "letter", title: "My final love letter", date: "",
      photo: "assets/photos/09.jpg", caption: "Frame, Beyond Words \uD83D\uDDBC\uFE0F\u2764\uFE0F" }
  ],

  /* ---------- Love letter (last page) ---------- */
  letter: {
    greeting: "My dearest Gayathri💕,",
    body: [
      "Ekkadidaka vachav ante you have seen all the pages. Hope you love your little surprise, bujjamma!.\nNa life lo nuv rakamundu varaku i used to have small insecurity that im not that smart and handsome, nanu evaru love cheyaru ani and pelli chesukodaniki kuda mundhuku raru ani but somehow maybe ma parents manchithanamo, nenu chesina mancho i got you, who is so beautiful in and out. Im so happy in that matter. Also nanu inthala naku vachey wife love chesthadi ani kuda expect cheyaledhu. You take care of me like how you take care of your parents. Naku emaina chinna pain vahcina, debba takina devudiki fasting untav, twaraga tagali ani. You are such a beautiful women i have ever seen after my cute mom😊",
      "Naku fever vachinapud entha baga chusukunav ante i have seen replica of my parents in you🥹. I felt so happy for being married to you. Nakosam edo oka varities chesthav intiki vachaka and edaina chesinapud like chapathi or dosa manchiga vachinavi naku vesi, baga ranivi nuv tintav (its so cute of you bangaram😘). Naku almost daily legs othuthav without any hesitation even when you're tried. Eppud temple ki velina you not only pray for you, ni chuttu unna friends and family kosam kuda pray chesthav. Ela ra intha kind and sweet hearted nuv. Ni chuttu pakkala evarikaina akali aythundi ante ni akali kuda pakkana petti vallaki isthav and niku machi jargina prathisari you feed / give money to some people on roadside.(Nuv chesey manchi valle the people around you are always happy for having you).",
      "Nakosam manam shopping ki vellinapud niku ey dress select chesina bagundi antav. You own my selection as your selection and nenu ala unna you always boost me saying entha cute unnav telusa ani. Nenu naku nachakapoyina niku nachestha.\nNenu eppud edi adgina no ani chepav even food or money or any matter.",
      "Monna na mood low ga undhi ani tinakunda afternoon ofc nunchi vachesav. Evng varaku em tinledhu and nenu leche sariki na favourite waffle order chesav. I felt so happy ah roju. Before marriage nenu low lo unna prathisari i used to talk to dad but eppud nuv kuda add ayavu. Nitho unna or share chesukuna kuda my mood lights up instantly.  Ela chepukuntu pothe you have so many good qualities in you.",
      "Nitho travel chesina 203 days ey intha happy ga unte, nitho life long entha happy ga untano. I always feel marrying you is one of my best decisions in my life. As i always say thank you so much for coming into my life bangaram (sorry vajaram 💎)."
    ],
    closing: "",
    signature: ""
  },

  /* ---------- The surprise (opens from the wax seal on the last page) ---------- */
  surprise: {
    buttonLabel: "One more thing\u2026",
    title: "Happy Birthday, my love!",
    text: "Once again, happy 25th birthday, bangaram!! \u2764\uFE0F. I wish to have you as my wife in my every lifetime, over and over again \u267E\uFE0F",
    photo: "",                                           // optional, e.g. "assets/photos/surprise.jpg"
    video: ""                                            // optional, e.g. "assets/videos/surprise.mp4"
  }
};
