import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Star,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Check,
  Filter,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

/* -------------------------------------------------------------------------
   Homeza — Design System tokens (reference)
   -----------------------------------------------------------------------
   Background : white / slate-50 (alt sections)
   Text       : slate-900 (headings) · slate-600 (body) · slate-500 (muted)
   Accent     : teal-700 (primary) · teal-50 / teal-100 (tints) · teal-900 (deep)
   Border     : slate-200
   Type       : Vazirmatn (RTL, Persian) — weights 400/500/600/700/800
   Radius     : rounded-2xl for cards, rounded-full for pills/icons
   Motion     : minimal — subtle hover/opacity transitions only
   ---------------------------------------------------------------------- */

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFa = (input) => String(input).replace(/[0-9]/g, (d) => faDigits[d]);
const formatPrice = (n) => `${toFa(n.toLocaleString("en-US"))} تومان`;

// Inverse of toFa — normalizes Persian digits a user may type (common on
// Persian keyboards) back to Western digits before validating phone/postal input.
const toEnDigits = (input) =>
  String(input).replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)));

// Normalizes Persian/Arabic text for search matching (unifies ی/ي, ک/ك,
// strips extra whitespace, case-folds any Latin characters in brand names).
const normalizeFa = (input) =>
  String(input)
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();

/* ---------------------------- Category icons ---------------------------- */
/* Custom minimal line-icon set — the visual signature of the Homeza brand. */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function FridgeIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="6" y1="9.5" x2="18" y2="9.5" />
      <line x1="9" y1="4.5" x2="9" y2="7" />
      <line x1="9" y1="12" x2="9" y2="15" />
    </svg>
  );
}

function WashingMachineIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="7" y1="6" x2="9" y2="6" />
      <circle cx="16" cy="6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="5" />
      <circle cx="12" cy="14.5" r="2" />
    </svg>
  );
}

function VacuumIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="8" cy="16" r="4" />
      <path d="M11.2 13.2c3-0.6 5.3-3.2 5.8-6.2" />
      <line x1="17" y1="7" x2="19.2" y2="4.5" />
      <line x1="6.5" y1="19.2" x2="5.2" y2="20.8" />
    </svg>
  );
}

function TvIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

function CookingPotIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M4 10h16l-1.1 7.7A2 2 0 0 1 16.9 19.5H7.1a2 2 0 0 1-2-1.8L4 10z" />
      <line x1="1.8" y1="9" x2="4.3" y2="9" />
      <line x1="19.7" y1="9" x2="22.2" y2="9" />
      <line x1="12" y1="6.5" x2="12" y2="10" />
      <circle cx="12" cy="4.6" r="1.1" />
    </svg>
  );
}

function BlenderIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M8.5 3h7l-1.2 12.5H9.7L8.5 3z" />
      <rect x="7.2" y="15.5" width="9.6" height="5" rx="1.2" />
      <line x1="9.5" y1="7" x2="14.5" y2="9" />
      <line x1="9.5" y1="9.5" x2="14.5" y2="7.5" />
    </svg>
  );
}

/* ------------------------------- Logo mark ------------------------------- */

function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="currentColor" />
      <circle cx="16" cy="16" r="6.5" fill="none" stroke="white" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="1.6" fill="white" />
    </svg>
  );
}

/* ----------------------------- Reusable atoms ---------------------------- */

function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`py-14 md:py-20 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="h-[3px] w-8 rounded-full bg-teal-700" />
      <span className="text-sm font-semibold text-teal-700">{children}</span>
    </div>
  );
}

function Button({ children, variant = "primary", className = "", href, ...rest }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-teal-700",
    secondary:
      "bg-white text-teal-800 border border-teal-200 hover:bg-teal-50 focus-visible:outline-teal-700",
    inverse: "bg-white text-teal-900 hover:bg-teal-50 focus-visible:outline-white",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  // Renders as a real link only when href is explicitly passed; otherwise a
  // button, since most CTAs now drive in-app navigation (no real routes).
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

/* --------------------------------- Data ---------------------------------- */

const navLinks = ["خانه", "محصولات", "دسته‌بندی‌ها", "درباره ما", "تماس با ما"];

const categories = [
  { name: "یخچال و فریزر", Icon: FridgeIcon },
  { name: "ماشین لباسشویی", Icon: WashingMachineIcon },
  { name: "جاروبرقی", Icon: VacuumIcon },
  { name: "تلویزیون", Icon: TvIcon },
  { name: "لوازم آشپزخانه", Icon: CookingPotIcon },
  { name: "لوازم کوچک خانگی", Icon: BlenderIcon },
];

// Maps each category name to its custom line-icon, reusing the Sprint 1
// icon set. `image` on a product is a semantic key into this map — this is
// a portfolio demo with no real product photography, so cards render the
// matching brand icon on a tinted tile instead of a photo.
const CATEGORY_ICONS = categories.reduce((acc, c) => {
  acc[c.name] = c.Icon;
  return acc;
}, {});

// Shared fallback used everywhere a product's placeholder "image" is
// rendered (product cards, details, cart, checkout summary) — keeps the
// three-level fallback in one place instead of repeating it per component.
function getProductIcon(product) {
  return CATEGORY_ICONS[product.image] || CATEGORY_ICONS[product.category] || FridgeIcon;
}

// Local, original flat illustrations — one per category, stored under
// public/images/products/ so the demo never depends on an external image
// host. `image` on a product already stores the category name (see
// CATEGORY_ICONS above); this map reuses that exact same key rather than
// introducing a second, divergent way to address a product's picture.
const CATEGORY_IMAGES = {
  "یخچال و فریزر": "/images/products/fridge.svg",
  "ماشین لباسشویی": "/images/products/washing-machine.svg",
  "جاروبرقی": "/images/products/vacuum.svg",
  "تلویزیون": "/images/products/tv.svg",
  "لوازم آشپزخانه": "/images/products/kitchen.svg",
  "لوازم کوچک خانگی": "/images/products/small-appliance.svg",
};

function getProductImageSrc(product) {
  return CATEGORY_IMAGES[product.image] || CATEGORY_IMAGES[product.category] || null;
}

// Single reusable image tile used by every place a product picture is
// shown (card, details, cart line, checkout summary) — so a product can
// never show one image in one place and something else elsewhere. Falls
// back to the existing category icon (identical sizing/styling as before)
// if there is no mapped image or the image fails to load, so a missing
// asset can never break the page.
function ProductImage({ product, className = "", iconClassName = "h-12 w-12" }) {
  const src = getProductImageSrc(product);
  const Icon = getProductIcon(product);
  const [errored, setErrored] = useState(false);

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      {src && !errored ? (
        <img
          src={src}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <Icon className={`text-teal-700 ${iconClassName}`} />
      )}
    </div>
  );
}

/* --------------------------------- Products -------------------------------- */
/* Mock catalog — stable local data, no external product API. */

const PRODUCTS = [
  {
    id: 1,
    name: "یخچال فریزر دوقلو ۲۸ فوت",
    category: "یخچال و فریزر",
    brand: "اسنوا",
    price: 62000000,
    oldPrice: 68000000,
    discount: 9,
    rating: 4.7,
    reviewCount: 128,
    shortDescription: "یخچال فریزر دوقلو با فناوری نوفراست و طراحی استیل.",
    fullDescription:
      "یخچال فریزر دوقلو ۲۸ فوت با فناوری نوفراست، سیستم خنک‌سازی یکنواخت و بدنه استیل ضدلک. مناسب خانواده‌های ۴ تا ۶ نفره با فضای داخلی بزرگ و قفسه‌های شیشه‌ای مقاوم.",
    image: "یخچال و فریزر",
    availability: true,
    featured: true,
  },
  {
    id: 2,
    name: "یخچال ساید بای ساید هوشمند",
    category: "یخچال و فریزر",
    brand: "ال‌جی",
    price: 89500000,
    oldPrice: null,
    discount: 0,
    rating: 4.8,
    reviewCount: 94,
    shortDescription: "ساید بای ساید با یخ‌ساز داخلی و نمایشگر لمسی.",
    fullDescription:
      "یخچال ساید بای ساید با یخ‌ساز و آب‌سردکن داخلی، نمایشگر لمسی برای تنظیم دما و حالت‌های ذخیره‌سازی هوشمند برای هر بخش از یخچال.",
    image: "یخچال و فریزر",
    availability: true,
    featured: false,
  },
  {
    id: 3,
    name: "فریزر ایستاده ۷ کشو",
    category: "یخچال و فریزر",
    brand: "پاکشوما",
    price: 34200000,
    oldPrice: 37900000,
    discount: 10,
    rating: 4.4,
    reviewCount: 51,
    shortDescription: "فریزر ایستاده با ۷ کشو و مصرف انرژی پایین.",
    fullDescription:
      "فریزر ایستاده ۷ کشویی با رده مصرف انرژی بالا، مناسب نگهداری بلندمدت مواد غذایی و طراحی جمع‌وجور برای آشپزخانه‌های متوسط.",
    image: "یخچال و فریزر",
    availability: true,
    featured: false,
  },
  {
    id: 4,
    name: "ماشین لباسشویی ۸ کیلویی",
    category: "ماشین لباسشویی",
    brand: "بوش",
    price: 41000000,
    oldPrice: null,
    discount: 0,
    rating: 4.9,
    reviewCount: 210,
    shortDescription: "ماشین لباسشویی آلمانی با موتور اینورتر بی‌صدا.",
    fullDescription:
      "ماشین لباسشویی ۸ کیلویی با موتور اینورتر کم‌صدا، برنامه‌های شست‌وشوی متنوع و رده مصرف انرژی A+++، ساخت آلمان.",
    image: "ماشین لباسشویی",
    availability: true,
    featured: true,
  },
  {
    id: 5,
    name: "ماشین لباسشویی ۷ کیلویی",
    category: "ماشین لباسشویی",
    brand: "جی‌پلاس",
    price: 23500000,
    oldPrice: 26000000,
    discount: 10,
    rating: 4.5,
    reviewCount: 76,
    shortDescription: "ماشین لباسشویی اقتصادی با برنامه شست‌وشوی سریع.",
    fullDescription:
      "ماشین لباسشویی ۷ کیلویی با برنامه شست‌وشوی سریع ۱۵ دقیقه‌ای، مناسب خانواده‌های کوچک و متوسط با قیمتی مقرون‌به‌صرفه.",
    image: "ماشین لباسشویی",
    availability: true,
    featured: false,
  },
  {
    id: 6,
    name: "ماشین لباسشویی و خشک‌کن توکار",
    category: "ماشین لباسشویی",
    brand: "سامسونگ",
    price: 58000000,
    oldPrice: null,
    discount: 0,
    rating: 4.6,
    reviewCount: 39,
    shortDescription: "ترکیب شست‌وشو و خشک‌کن در یک دستگاه توکار.",
    fullDescription:
      "ماشین لباسشویی و خشک‌کن توکار دو در یک، مناسب آشپزخانه‌های مدرن با فضای محدود و دارای برنامه‌های هوشمند شست‌وشو و خشک‌کردن.",
    image: "ماشین لباسشویی",
    availability: true,
    featured: false,
  },
  {
    id: 7,
    name: "جاروبرقی بدون کیسه",
    category: "جاروبرقی",
    brand: "فیلیپس",
    price: 7800000,
    oldPrice: null,
    discount: 0,
    rating: 4.5,
    reviewCount: 143,
    shortDescription: "جاروبرقی بدون کیسه با قدرت مکش بالا و فیلتر هپا.",
    fullDescription:
      "جاروبرقی بدون کیسه با فیلتر هپا برای حذف آلرژن‌ها، مخزن بزرگ گردوغبار و طراحی سبک برای جابه‌جایی راحت در خانه.",
    image: "جاروبرقی",
    availability: true,
    featured: true,
  },
  {
    id: 8,
    name: "جاروبرقی رباتیک هوشمند",
    category: "جاروبرقی",
    brand: "شیائومی",
    price: 18500000,
    oldPrice: 21000000,
    discount: 12,
    rating: 4.3,
    reviewCount: 67,
    shortDescription: "جارو رباتیک با نقشه‌برداری هوشمند از خانه.",
    fullDescription:
      "جاروبرقی رباتیک با نقشه‌برداری لیزری از فضای خانه، کنترل از طریق اپلیکیشن موبایل و قابلیت شارژ خودکار در ایستگاه.",
    image: "جاروبرقی",
    availability: true,
    featured: false,
  },
  {
    id: 9,
    name: "جاروبرقی سطلی صنعتی",
    category: "جاروبرقی",
    brand: "دلمونتی",
    price: 5200000,
    oldPrice: null,
    discount: 0,
    rating: 4.1,
    reviewCount: 22,
    shortDescription: "جاروبرقی سطلی مناسب نظافت سنگین و کارگاهی.",
    fullDescription:
      "جاروبرقی سطلی با موتور پرقدرت، مناسب نظافت مواد خشک و مرطوب در کارگاه یا انبار، دارای مخزن بزرگ و بدنه مقاوم.",
    image: "جاروبرقی",
    availability: false,
    featured: false,
  },
  {
    id: 10,
    name: "تلویزیون هوشمند ۵۵ اینچ ۴K",
    category: "تلویزیون",
    brand: "تی‌سی‌ال",
    price: 31900000,
    oldPrice: 35500000,
    discount: 10,
    rating: 4.6,
    reviewCount: 88,
    shortDescription: "تلویزیون هوشمند با رزولوشن ۴K و پنل روشن.",
    fullDescription:
      "تلویزیون هوشمند ۵۵ اینچ با رزولوشن ۴K، سیستم‌عامل هوشمند برای دسترسی به سرویس‌های پخش آنلاین و پردازنده تصویر قدرتمند.",
    image: "تلویزیون",
    availability: true,
    featured: true,
  },
  {
    id: 11,
    name: "تلویزیون OLED ۶۵ اینچ",
    category: "تلویزیون",
    brand: "ال‌جی",
    price: 112000000,
    oldPrice: null,
    discount: 0,
    rating: 4.9,
    reviewCount: 45,
    shortDescription: "پنل OLED با سیاه مطلق و رنگ‌های واقعی.",
    fullDescription:
      "تلویزیون ۶۵ اینچ با پنل OLED، کنتراست بی‌نهایت، رنگ‌های دقیق سینمایی و طراحی باریک برای فضاهای پذیرایی مدرن.",
    image: "تلویزیون",
    availability: true,
    featured: false,
  },
  {
    id: 12,
    name: "تلویزیون ۴۳ اینچ اندروید",
    category: "تلویزیون",
    brand: "ایکس ویژن",
    price: 16700000,
    oldPrice: null,
    discount: 0,
    rating: 4.2,
    reviewCount: 39,
    shortDescription: "تلویزیون اقتصادی با سیستم‌عامل اندروید.",
    fullDescription:
      "تلویزیون ۴۳ اینچ با سیستم‌عامل اندروید، دسترسی به فروشگاه اپلیکیشن و کیفیت تصویر مناسب برای اتاق خواب یا آشپزخانه.",
    image: "تلویزیون",
    availability: false,
    featured: false,
  },
  {
    id: 13,
    name: "پلوپز دیجیتال ۸ نفره",
    category: "لوازم آشپزخانه",
    brand: "پارس خزر",
    price: 3450000,
    oldPrice: null,
    discount: 0,
    rating: 4.4,
    reviewCount: 112,
    shortDescription: "پلوپز دیجیتال با صفحه لمسی و برنامه‌های متنوع.",
    fullDescription:
      "پلوپز دیجیتال ۸ نفره با صفحه لمسی، برنامه‌های پخت متنوع برای انواع برنج و غذا، و بدنه ضدخش با پوشش سرامیکی.",
    image: "لوازم آشپزخانه",
    availability: true,
    featured: true,
  },
  {
    id: 14,
    name: "اجاق گاز فردار ۵ شعله",
    category: "لوازم آشپزخانه",
    brand: "اخوان",
    price: 27300000,
    oldPrice: null,
    discount: 0,
    rating: 4.7,
    reviewCount: 58,
    shortDescription: "اجاق گاز فردار با ۵ شعله و سیستم ایمنی گاز.",
    fullDescription:
      "اجاق گاز فردار ۵ شعله با فر داخلی، سیستم ایمنی قطع خودکار گاز و شعله‌های مجزا برای پخت هم‌زمان چند غذا.",
    image: "لوازم آشپزخانه",
    availability: true,
    featured: false,
  },
  {
    id: 15,
    name: "هود آشپزخانه شومینه‌ای",
    category: "لوازم آشپزخانه",
    brand: "بوش",
    price: 14900000,
    oldPrice: 16500000,
    discount: 10,
    rating: 4.5,
    reviewCount: 33,
    shortDescription: "هود شومینه‌ای با موتور کم‌صدا و مکش قوی.",
    fullDescription:
      "هود آشپزخانه شومینه‌ای با موتور کم‌صدا، مکش قوی برای حذف بو و دود، و طراحی مینیمال متناسب با آشپزخانه‌های مدرن.",
    image: "لوازم آشپزخانه",
    availability: true,
    featured: false,
  },
  {
    id: 16,
    name: "ماکروویو توکار",
    category: "لوازم آشپزخانه",
    brand: "سامسونگ",
    price: 19200000,
    oldPrice: null,
    discount: 0,
    rating: 4.3,
    reviewCount: 27,
    shortDescription: "ماکروویو توکار با گریل و برنامه‌های پخت خودکار.",
    fullDescription:
      "ماکروویو توکار با قابلیت گریل، برنامه‌های پخت خودکار برای غذاهای متنوع و طراحی هماهنگ با کابینت‌های آشپزخانه.",
    image: "لوازم آشپزخانه",
    availability: true,
    featured: false,
  },
  {
    id: 17,
    name: "مخلوط‌کن حرفه‌ای ۶ سرعته",
    category: "لوازم کوچک خانگی",
    brand: "فلر",
    price: 2150000,
    oldPrice: null,
    discount: 0,
    rating: 4.3,
    reviewCount: 96,
    shortDescription: "مخلوط‌کن با ۶ سرعت و لیوان شیشه‌ای مقاوم.",
    fullDescription:
      "مخلوط‌کن حرفه‌ای با ۶ درجه سرعت، تیغه‌های استیل ضدزنگ و لیوان شیشه‌ای مقاوم در برابر ضربه، مناسب اسموتی و سوپ.",
    image: "لوازم کوچک خانگی",
    availability: true,
    featured: true,
  },
  {
    id: 18,
    name: "اتو بخار حرفه‌ای",
    category: "لوازم کوچک خانگی",
    brand: "پارس خزر",
    price: 2850000,
    oldPrice: null,
    discount: 0,
    rating: 4.2,
    reviewCount: 64,
    shortDescription: "اتو بخار با کف سرامیکی و بخار قوی و پیوسته.",
    fullDescription:
      "اتو بخار حرفه‌ای با کف سرامیکی ضدچسبندگی، بخار قوی و پیوسته برای اتوی سریع‌تر پارچه‌های ضخیم و ظریف.",
    image: "لوازم کوچک خانگی",
    availability: true,
    featured: false,
  },
  {
    id: 19,
    name: "سشوار حرفه‌ای",
    category: "لوازم کوچک خانگی",
    brand: "فیلیپس",
    price: 1950000,
    oldPrice: null,
    discount: 0,
    rating: 4.6,
    reviewCount: 141,
    shortDescription: "سشوار با فناوری یون منفی برای موی سالم‌تر.",
    fullDescription:
      "سشوار حرفه‌ای با فناوری یون منفی برای کاهش وز مو، چند درجه حرارت و سرعت قابل تنظیم و طراحی سبک برای استفاده روزانه.",
    image: "لوازم کوچک خانگی",
    availability: true,
    featured: false,
  },
  {
    id: 20,
    name: "توستر نان دو اسلات",
    category: "لوازم کوچک خانگی",
    brand: "دلمونتی",
    price: 1480000,
    oldPrice: 1690000,
    discount: 12,
    rating: 4.0,
    reviewCount: 18,
    shortDescription: "توستر جمع‌وجور با درجه برشتگی قابل تنظیم.",
    fullDescription:
      "توستر نان دو اسلات با درجه برشتگی قابل تنظیم، سینی خرده‌گیر قابل شست‌وشو و بدنه فشرده مناسب آشپزخانه‌های کوچک.",
    image: "لوازم کوچک خانگی",
    availability: true,
    featured: false,
  },
];

const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort((a, b) =>
  a.localeCompare(b, "fa")
);

// Category card counts are derived from the real catalog instead of being
// hardcoded, so they can never drift out of sync with PRODUCTS again.
const CATEGORY_PRODUCT_COUNTS = categories.reduce((acc, c) => {
  acc[c.name] = PRODUCTS.filter((p) => p.category === c.name).length;
  return acc;
}, {});

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "popular", label: "محبوب‌ترین" },
];

const RATING_OPTIONS = [
  { value: 0, label: "همه امتیازها" },
  { value: 4, label: "۴ ستاره و بالاتر" },
  { value: 4.5, label: "۴.۵ ستاره و بالاتر" },
];

const whyHomeza = [
  { title: "ارسال سریع", desc: "تحویل درِ منزل در سریع‌ترین زمان ممکن، در سراسر کشور.", Icon: Truck },
  { title: "ضمانت اصالت کالا", desc: "تمام محصولات دارای گارانتی رسمی و ضمانت اصالت هستند.", Icon: ShieldCheck },
  { title: "پشتیبانی", desc: "تیم پشتیبانی همزا همیشه پاسخ‌گوی سوالات شماست.", Icon: Headphones },
  { title: "امکان بازگشت کالا", desc: "هفت روز فرصت برای بازگشت کالا، بدون دردسر.", Icon: RotateCcw },
];

// Derives a short spec sheet from a product's existing fields — this is a
// computed view, not a new hardcoded dataset, so the 20-product catalog
// stays the single source of truth.
function buildSpecs(product) {
  return [
    { label: "برند", value: product.brand },
    { label: "دسته‌بندی", value: product.category },
    { label: "کد کالا", value: `HZ-${String(product.id).padStart(4, "0")}` },
    { label: "گارانتی", value: "۱۸ ماهه ضمانت اصالت و سلامت فیزیکی همزا" },
  ];
}

/* --------------------------------- Cart state -------------------------------- */
/* Single source of truth for the cart, shared via context across Header,
   product cards, product details and the cart view — no independent copies. */

const CART_STORAGE_KEY = "homeza-cart-v1";
const MAX_QTY = 5;
const FREE_SHIPPING_THRESHOLD = 5000000;
const SHIPPING_COST = 150000;

const CartContext = React.createContext(null);

function useCart() {
  return React.useContext(CartContext);
}

function Toast({ message }) {
  return (
    <div className="fixed bottom-5 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none">
      <div className="flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-medium pl-4 pr-3 py-2.5 shadow-lg">
        <span className="h-5 w-5 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
          <Check className="h-3.5 w-3.5" />
        </span>
        {message}
      </div>
    </div>
  );
}

// Reads and validates any previously saved cart. Called as a lazy useState
// initializer (runs once, synchronously, during the first render) so the
// cart is already hydrated before any effect — including the persistence
// effect — ever runs. This is what removes the hydrate/persist race: there
// is no longer a separate "load on mount" effect that could lose to the
// persistence effect firing with the still-empty initial state.
function loadPersistedCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const validIds = new Set(PRODUCTS.map((p) => p.id));
    const safeCart = {};
    for (const [id, qty] of Object.entries(parsed)) {
      const numId = Number(id);
      const numQty = Number(qty);
      if (validIds.has(numId) && Number.isInteger(numQty) && numQty >= 1 && numQty <= MAX_QTY) {
        safeCart[numId] = numQty;
      }
    }
    return safeCart;
  } catch {
    // localStorage unavailable or the saved value is corrupt — start empty.
    return {};
  }
}

function CartProvider({ children }) {
  const [cart, setCart] = useState(loadPersistedCart); // lazy initializer — runs once, before any effect
  const [toast, setToast] = useState(null);
  const toastTimer = React.useRef(null);

  // Persist on every change. Safe to run on mount too now: `cart` already
  // holds the hydrated (validated) value by the time this first fires.
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore — persistence is a nice-to-have, not required for the cart to work.
    }
  }, [cart]);

  // Clear any pending toast timer if the provider ever unmounts.
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.availability) return;
    setCart((prev) => {
      const current = prev[product.id] || 0;
      return { ...prev, [product.id]: Math.min(MAX_QTY, current + quantity) };
    });
    showToast(`«${product.name}» به سبد خرید اضافه شد`);
  };

  const increaseQty = (id) =>
    setCart((prev) => ({ ...prev, [id]: Math.min(MAX_QTY, (prev[id] || 0) + 1) }));

  const decreaseQty = (id) =>
    setCart((prev) => {
      const next = (prev[id] || 0) - 1;
      if (next <= 0) {
        const { [id]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });

  const removeFromCart = (id) =>
    setCart((prev) => {
      const { [id]: _omit, ...rest } = prev;
      return rest;
    });

  const clearCart = () => setCart({});

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const product = PRODUCTS.find((p) => p.id === Number(id));
        return product ? { product, quantity, lineTotal: product.price * quantity } : null;
      })
      .filter(Boolean);
  }, [cart]);

  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const value = {
    cart,
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && <Toast message={toast} />}
    </CartContext.Provider>
  );
}

/* -------------------------------- Header --------------------------------- */

// Nav links that now lead somewhere in this sprint. "دسته‌بندی‌ها" routes into
// the Products page (its category filter lives there); About/Contact stay
// inert placeholders since those pages are out of scope for this sprint.
const NAV_ACTIONS = {
  "خانه": "home",
  "محصولات": "products",
  "دسته‌بندی‌ها": "products",
};

function Header({ page, onNavigateHome, onNavigateProducts, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const handleNav = (link) => {
    const target = NAV_ACTIONS[link];
    if (target === "home") onNavigateHome();
    else if (target === "products") onNavigateProducts();
    setMenuOpen(false);
  };

  const isActive = (link) =>
    (NAV_ACTIONS[link] === "home" && page === "home") ||
    (link === "محصولات" && page === "products");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <Container>
        <div className="flex h-16 md:h-20 items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 shrink-0"
          >
            <LogoMark className="h-8 w-8 text-teal-700" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              همزا
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              NAV_ACTIONS[link] ? (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleNav(link)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link) ? "text-teal-700 font-semibold" : "text-slate-700 hover:text-teal-700"
                  }`}
                >
                  {link}
                </button>
              ) : (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-medium text-slate-700 hover:text-teal-700 transition-colors"
                >
                  {link}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              aria-label="جستجوی محصولات"
              onClick={onNavigateProducts}
              className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="سبد خرید"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-teal-700 text-[10px] font-bold leading-4 text-center text-white">
                  {toFa(itemCount > 9 ? "9+" : itemCount)}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <Container>
            <nav className="flex flex-col py-2">
              {navLinks.map((link) =>
                NAV_ACTIONS[link] ? (
                  <button
                    key={link}
                    type="button"
                    onClick={() => handleNav(link)}
                    className={`py-3 text-right text-[15px] font-medium border-b border-slate-100 last:border-none ${
                      isActive(link) ? "text-teal-700 font-semibold" : "text-slate-700"
                    }`}
                  >
                    {link}
                  </button>
                ) : (
                  <a
                    key={link}
                    href="#"
                    className="py-3 text-[15px] font-medium text-slate-700 border-b border-slate-100 last:border-none"
                  >
                    {link}
                  </a>
                )
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

/* --------------------------------- Hero ---------------------------------- */

function Hero({ onNavigateProducts }) {
  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section className="pt-12 pb-14 md:pt-20 md:pb-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <Eyebrow>فروشگاه اینترنتی لوازم خانگی</Eyebrow>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.25] md:leading-[1.2]">
              لوازم خانگی، انتخابی برای زندگی بهتر
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-8">
              از یخچال و ماشین لباسشویی تا کوچک‌ترین لوازم آشپزخانه؛ همزا
              مجموعه‌ای منتخب از برندهای معتبر را با ضمانت اصالت کالا و ارسال
              سریع در اختیار شما قرار می‌دهد.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Button variant="primary" onClick={onNavigateProducts}>
                مشاهده محصولات
              </Button>
              <Button variant="secondary" onClick={scrollToCategories}>
                مشاهده دسته‌بندی‌ها
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-[2.5rem] bg-teal-50 border border-teal-100 grid grid-cols-3 gap-4 p-8 sm:p-10">
              {[FridgeIcon, WashingMachineIcon, TvIcon, CookingPotIcon, VacuumIcon, BlenderIcon].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-2xl bg-white border border-teal-100"
                  >
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-teal-700" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------ Categories ------------------------------- */

function Categories({ onSelectCategory }) {
  return (
    <Section id="categories" className="bg-slate-50">
      <Container>
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <Eyebrow>دسته‌بندی‌ها</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            خرید بر اساس دسته‌بندی
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => onSelectCategory(name)}
              className="block w-full text-right group"
            >
              <Card className="p-5 md:p-7 h-full flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[15px] md:text-base">
                    {name}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    {toFa(CATEGORY_PRODUCT_COUNTS[name])} کالا
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------- Product card ------------------------------ */
/* Shared by the Home "Featured products" section and the Products page grid. */

function ProductCard({ product, onOpenProduct }) {
  const { name, category, price, oldPrice, discount, rating, reviewCount, availability } = product;
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const addedTimer = React.useRef(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (!availability) return;
    addToCart(product, 1);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Card className="p-4 flex flex-col h-full relative">
      {discount > 0 && (
        <span className="absolute top-3 right-3 z-10 rounded-full bg-teal-700 text-white text-[11px] font-bold px-2 py-1">
          {toFa(discount)}٪ تخفیف
        </span>
      )}

      <button
        type="button"
        onClick={() => onOpenProduct?.(product.id)}
        className="block w-full text-right"
      >
        <div className="mb-4">
          <ProductImage
            product={product}
            className="aspect-square rounded-xl bg-slate-50 border border-slate-100"
            iconClassName="h-12 w-12"
          />
        </div>

        <span className="text-xs font-medium text-teal-700">{category}</span>
        <h3 className="mt-1 font-bold text-slate-900 text-[15px] leading-6 line-clamp-2">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-700">{toFa(rating)}</span>
          </div>
          <span className="text-xs text-slate-400">({toFa(reviewCount)} نظر)</span>
        </div>

        <div className="mt-2">
          <span
            className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${
              availability ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {availability ? "موجود" : "ناموجود"}
          </span>
        </div>
      </button>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 text-[15px]">
            {formatPrice(price)}
          </span>
          {oldPrice ? (
            <span className="text-xs text-slate-400 line-through">{formatPrice(oldPrice)}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!availability}
          aria-label="افزودن به سبد خرید"
          className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
            !availability
              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
              : added
              ? "bg-teal-700 text-white"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100"
          }`}
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </button>
      </div>
    </Card>
  );
}

function ProductGrid({ products, onOpenProduct, className = "" }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onOpenProduct={onOpenProduct} />
      ))}
    </div>
  );
}

function FeaturedProducts({ onNavigateProducts, onOpenProduct }) {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <Section>
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-12 text-center sm:text-right gap-4">
          <div>
            <Eyebrow>پیشنهاد همزا</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              محصولات منتخب
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={onNavigateProducts}
            className="self-center sm:self-auto px-0 hover:bg-transparent hover:text-teal-700"
          >
            مشاهده همه محصولات
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <ProductGrid products={featured} onOpenProduct={onOpenProduct} />
      </Container>
    </Section>
  );
}

/* ------------------------------ Promotional ------------------------------- */

function Promotional({ onSelectCategory }) {
  return (
    <Section className="py-0">
      <Container>
        <div className="rounded-[2rem] bg-teal-900 px-6 py-12 md:px-16 md:py-16 text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-block text-xs md:text-sm font-semibold text-teal-200 bg-teal-800 rounded-full px-3 py-1">
              پیشنهاد ویژه این هفته
            </span>
            <h2 className="mt-4 text-2xl md:text-4xl font-extrabold text-white leading-[1.35]">
              تا ۳۰٪ تخفیف روی لوازم آشپزخانه
            </h2>
            <p className="mt-3 text-teal-100 text-sm md:text-base max-w-md">
              منتخبی از لوازم آشپزخانه و لوازم کوچک خانگی، فقط تا پایان این
              هفته با تخفیف ویژه.
            </p>
          </div>
          <Button variant="inverse" className="shrink-0" onClick={() => onSelectCategory("لوازم آشپزخانه")}>
            مشاهده تخفیف‌ها
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------- Why Homeza ------------------------------ */

function WhyHomeza() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <Eyebrow>چرا همزا</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            خرید مطمئن از همزا
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {whyHomeza.map(({ title, desc, Icon }) => (
            <Card key={title} className="p-6 text-center flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 leading-6">{desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------- Final CTA -------------------------------- */

function FinalCTA({ onNavigateProducts }) {
  return (
    <Section>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-[1.35]">
            آماده‌اید خانه‌تان را ارتقا دهید؟
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            همین حالا مجموعه کامل محصولات همزا را ببینید.
          </p>
          <div className="mt-7 flex justify-center">
            <Button variant="primary" onClick={onNavigateProducts}>
              مشاهده همه محصولات
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------- Footer ---------------------------------- */

function Footer({ onNavigateHome, onNavigateProducts, onSelectCategory }) {
  const handleNav = (link) => {
    const target = NAV_ACTIONS[link];
    if (target === "home") onNavigateHome();
    else if (target === "products") onNavigateProducts();
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LogoMark className="h-8 w-8 text-teal-500" />
              <span className="text-lg font-extrabold text-white">همزا</span>
            </div>
            <p className="text-sm leading-7 text-slate-400 max-w-xs">
              همزا فروشگاهی آنلاین برای لوازم خانگی با تمرکز بر کیفیت، اصالت
              کالا و تجربه‌ای ساده برای خرید.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="اینستاگرام" className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-700 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="توییتر" className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-700 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="لینکدین" className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-700 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">لینک‌های اصلی</h4>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link}>
                  {NAV_ACTIONS[link] ? (
                    <button type="button" onClick={() => handleNav(link)} className="hover:text-white transition-colors">
                      {link}
                    </button>
                  ) : (
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-3 text-sm">
              {categories.slice(0, 5).map((c) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(c.name)}
                    className="hover:text-white transition-colors"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-500 shrink-0" />
                <span>تهران، ایران</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-500 shrink-0" />
                <span dir="ltr">۰۲۱-۰۰۰۰۰۰۰</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                <span dir="ltr">info@homeza.demo</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-slate-800">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© ۱۴۰۵ همزا. تمام حقوق محفوظ است.</span>
          <span>یک نمونه‌کار طراحی و توسعه وب</span>
        </Container>
      </div>
    </footer>
  );
}

/* -------------------------------- Search bar -------------------------------- */

function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-xl mx-auto lg:mx-0">
      <Search className="absolute top-1/2 -translate-y-1/2 right-4 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجوی محصول، برند یا دسته‌بندی..."
        className="w-full rounded-full border border-slate-200 bg-white py-3 pr-11 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جستجو"
          className="absolute top-1/2 -translate-y-1/2 left-3 h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* -------------------------------- Filter panel ------------------------------- */
/* Single source of truth for filter controls — rendered in the desktop
   sidebar and, unchanged, inside the mobile bottom sheet. */

function FilterPanel({
  category,
  setCategory,
  selectedBrands,
  toggleBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  onlyAvailable,
  setOnlyAvailable,
  onClear,
}) {
  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">دسته‌بندی</h3>
        <div className="flex flex-wrap gap-2">
          {["همه", ...categories.map((c) => c.name)].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                category === name
                  ? "bg-teal-700 border-teal-700 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">برند</h3>
        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700/40"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">محدوده قیمت (تومان)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            dir="ltr"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="حداقل"
            className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
          />
          <span className="text-slate-400 text-sm">تا</span>
          <input
            type="number"
            inputMode="numeric"
            dir="ltr"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="حداکثر"
            className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">امتیاز</h3>
        <div className="flex flex-col gap-2">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === opt.value}
                onChange={() => setMinRating(opt.value)}
                className="h-4 w-4 border-slate-300 text-teal-700 focus:ring-teal-700/40"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700/40"
          />
          فقط کالاهای موجود
        </label>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="text-sm font-semibold text-teal-700 hover:text-teal-800"
      >
        پاک کردن فیلترها
      </button>
    </div>
  );
}

function MobileFilterSheet({ resultCount, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-900">فیلترها</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن فیلترها"
            className="h-9 w-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
        <Button variant="primary" onClick={onClose} className="w-full mt-7">
          نمایش {toFa(resultCount)} نتیجه
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------- Sort select ------------------------------- */

function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/* --------------------------------- Empty state ------------------------------- */

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
        <Search className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">محصولی با این مشخصات پیدا نشد</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        کلمه جستجو را تغییر دهید یا فیلترهای اعمال‌شده را پاک کنید تا نتایج بیشتری ببینید.
      </p>
      <Button variant="secondary" onClick={onClear} className="mt-6">
        پاک کردن فیلترها
      </Button>
    </div>
  );
}

/* -------------------------------- Products page ------------------------------ */

function ProductsPage({ initialCategory, onOpenProduct }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory || "همه");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo?.({ top: 0 });
  }, []);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setCategory("همه");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setOnlyAvailable(false);
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (category !== "همه" && p.category !== category) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (minRating && p.rating < minRating) return false;
      if (onlyAvailable && !p.availability) return false;
      if (search.trim()) {
        const q = normalizeFa(search);
        const haystack = normalizeFa(`${p.name} ${p.brand} ${p.category} ${p.shortDescription}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    switch (sortBy) {
      case "cheap":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "expensive":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list = [...list].sort((a, b) => b.id - a.id);
    }
    return list;
  }, [search, category, selectedBrands, minPrice, maxPrice, minRating, onlyAvailable, sortBy]);

  const activeFilterCount =
    (category !== "همه" ? 1 : 0) +
    selectedBrands.length +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyAvailable ? 1 : 0);

  const filterPanelProps = {
    category,
    setCategory,
    selectedBrands,
    toggleBrand,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    onlyAvailable,
    setOnlyAvailable,
    onClear: clearFilters,
  };

  return (
    <div>
      <Section className="pt-10 pb-6 md:pt-14">
        <Container>
          <div className="text-center lg:text-right">
            <Eyebrow>محصولات همزا</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">همهٔ محصولات</h1>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto lg:mx-0">
              مجموعه کامل لوازم خانگی همزا را جست‌وجو، فیلتر و مرتب‌سازی کنید تا محصول مناسب خودتان را پیدا کنید.
            </p>
          </div>
          <div className="mt-6">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </Container>
      </Section>

      <Section className="pt-0 pb-16 md:pb-24">
        <Container>
          <div className="flex items-center justify-between gap-3 mb-5 lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              <Filter className="h-4 w-4" />
              فیلترها
              {activeFilterCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-teal-700 text-white text-[11px] font-bold flex items-center justify-center">
                  {toFa(activeFilterCount)}
                </span>
              )}
            </button>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h2 className="text-sm font-bold text-slate-900 mb-5">فیلترها</h2>
                <FilterPanel {...filterPanelProps} />
              </div>
            </aside>

            <div>
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500">
                  {toFa(filtered.length)} محصول از {toFa(PRODUCTS.length)} یافت شد
                </p>
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
              <p className="lg:hidden text-sm text-slate-500 mb-4">
                {toFa(filtered.length)} محصول از {toFa(PRODUCTS.length)} یافت شد
              </p>

              {filtered.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <ProductGrid products={filtered} onOpenProduct={onOpenProduct} />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {filtersOpen && (
        <MobileFilterSheet resultCount={filtered.length} onClose={() => setFiltersOpen(false)}>
          <FilterPanel {...filterPanelProps} />
        </MobileFilterSheet>
      )}
    </div>
  );
}

/* ----------------------------- Quantity selector ----------------------------- */
/* Reused by Product Details and each cart line item. */

function QuantitySelector({ value, onIncrease, onDecrease, min = 1, max = MAX_QTY, disabled }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || value <= min}
        aria-label="کاهش تعداد"
        className="h-8 w-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-bold text-slate-800">{toFa(value)}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled || value >= max}
        aria-label="افزایش تعداد"
        className="h-8 w-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ----------------------------- Related products ------------------------------ */

function RelatedProducts({ products, onOpenProduct }) {
  if (!products.length) return null;
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <Eyebrow>محصولات مرتبط</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            شاید این محصولات را هم بپسندید
          </h2>
        </div>
        <ProductGrid products={products} onOpenProduct={onOpenProduct} />
      </Container>
    </Section>
  );
}

/* ------------------------------- Product details ------------------------------ */

function ProductDetails({ productId, onBack, onOpenProduct }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const { cart, addToCart } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo?.({ top: 0 });
    setQty(1);
  }, [productId]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCategory = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    let list = sameCategory.slice(0, 4);
    if (list.length < 3) {
      const fillers = PRODUCTS.filter(
        (p) => p.id !== product.id && !list.some((l) => l.id === p.id)
      );
      list = [...list, ...fillers].slice(0, 4);
    }
    return list;
  }, [product]);

  if (!product) {
    return (
      <Section className="py-20 text-center">
        <Container>
          <p className="text-slate-600">این محصول پیدا نشد.</p>
          <Button variant="secondary" onClick={onBack} className="mt-6">
            بازگشت به محصولات
          </Button>
        </Container>
      </Section>
    );
  }

  const specs = buildSpecs(product);
  const inCartQty = cart[product.id] || 0;

  return (
    <div>
      <Section className="pt-8 pb-0">
        <Container>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به محصولات
          </button>
        </Container>
      </Section>

      <Section className="pt-6 pb-10 md:pb-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="relative">
              {product.discount > 0 && (
                <span className="absolute top-4 right-4 z-10 rounded-full bg-teal-700 text-white text-xs font-bold px-2.5 py-1">
                  {toFa(product.discount)}٪ تخفیف
                </span>
              )}
              <ProductImage
                product={product}
                className="aspect-square rounded-3xl bg-teal-50 border border-teal-100"
                iconClassName="h-28 w-28 sm:h-36 sm:w-36"
              />
            </div>

            <div>
              <span className="text-xs font-medium text-teal-700">{product.category}</span>
              <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-slate-500">برند: {product.brand}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-700">{toFa(product.rating)}</span>
                </div>
                <span className="text-sm text-slate-400">({toFa(product.reviewCount)} نظر)</span>
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice ? (
                  <span className="text-sm text-slate-400 line-through mb-1">
                    {formatPrice(product.oldPrice)}
                  </span>
                ) : null}
              </div>

              <span
                className={`mt-3 inline-block text-xs font-semibold rounded-full px-2.5 py-1 ${
                  product.availability ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {product.availability ? "موجود" : "ناموجود"}
              </span>

              <p className="mt-5 text-slate-600 leading-7">{product.shortDescription}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <QuantitySelector
                  value={qty}
                  onIncrease={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                  onDecrease={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={!product.availability}
                />
                <Button
                  variant="primary"
                  disabled={!product.availability}
                  onClick={() => addToCart(product, qty)}
                  className={!product.availability ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {product.availability ? "افزودن به سبد خرید" : "ناموجود"}
                </Button>
              </div>
              {inCartQty > 0 && (
                <p className="mt-3 text-xs text-teal-700 font-medium">
                  {toFa(inCartQty)} عدد از این کالا در سبد خرید شماست
                </p>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 mb-2">توضیحات کامل</h2>
                <p className="text-sm text-slate-600 leading-7">{product.fullDescription}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 mb-3">مشخصات فنی</h2>
                <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {specs.map((s) => (
                    <React.Fragment key={s.label}>
                      <dt className="text-sm text-slate-500">{s.label}</dt>
                      <dd className="text-sm font-medium text-slate-800">{s.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <RelatedProducts products={related} onOpenProduct={onOpenProduct} />
    </div>
  );
}

/* --------------------------------- Cart view ---------------------------------- */

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity, lineTotal } = item;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <ProductImage
          product={product}
          className="h-20 w-20 shrink-0 rounded-xl bg-slate-50 border border-slate-100"
          iconClassName="h-9 w-9"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-medium text-teal-700">{product.category}</span>
              <h3 className="font-bold text-slate-900 text-[15px] leading-6 truncate">{product.name}</h3>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label="حذف از سبد خرید"
              className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">قیمت واحد: {formatPrice(product.price)}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <QuantitySelector value={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
        <span className="font-extrabold text-slate-900 text-[15px]">{formatPrice(lineTotal)}</span>
      </div>
    </Card>
  );
}

function CartSummary({ subtotal, shipping, total, onContinueShopping, onCheckout }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  return (
    <Card className="p-6 h-fit lg:sticky lg:top-24">
      <h2 className="font-extrabold text-slate-900 mb-4">خلاصه سفارش</h2>
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>جمع کالاها</span>
          <span className="font-medium text-slate-800">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>هزینه ارسال</span>
          <span className={`font-medium ${shipping === 0 ? "text-teal-700" : "text-slate-800"}`}>
            {shipping === 0 ? "رایگان" : formatPrice(shipping)}
          </span>
        </div>
        {shipping > 0 && remaining > 0 && (
          <p className="text-xs text-slate-500 leading-6">
            {formatPrice(remaining)} دیگر خرید کنید تا ارسال رایگان شود.
          </p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="font-bold text-slate-900">مبلغ قابل پرداخت</span>
        <span className="font-extrabold text-lg text-slate-900">{formatPrice(total)}</span>
      </div>
      <Button variant="primary" onClick={onCheckout} className="w-full mt-6">
        ثبت سفارش
      </Button>
      <Button variant="ghost" onClick={onContinueShopping} className="w-full mt-2">
        ادامه خرید
      </Button>
    </Card>
  );
}

function EmptyCart({ onContinueShopping }) {
  return (
    <Section className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <ShoppingCart className="h-7 w-7 text-slate-400" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">سبد خرید شما خالی است</h1>
          <p className="mt-2 text-sm text-slate-500">
            هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. نگاهی به محصولات همزا بیندازید.
          </p>
          <Button variant="primary" onClick={onContinueShopping} className="mt-6">
            مشاهده محصولات
          </Button>
        </div>
      </Container>
    </Section>
  );
}

function CartView({ onContinueShopping, onCheckout }) {
  const { items, itemCount, subtotal, shipping, total, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    window.scrollTo?.({ top: 0 });
  }, []);

  if (items.length === 0) {
    return <EmptyCart onContinueShopping={onContinueShopping} />;
  }

  return (
    <Section className="pt-10 pb-16 md:pb-24">
      <Container>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <Eyebrow>سبد خرید</Eyebrow>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              سبد خرید شما ({toFa(itemCount)} کالا)
            </h1>
          </div>
          {!confirmingClear ? (
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              خالی کردن سبد
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm shrink-0">
              <span className="text-slate-500">مطمئنید؟</span>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setConfirmingClear(false);
                }}
                className="font-semibold text-rose-600"
              >
                بله
              </button>
              <button type="button" onClick={() => setConfirmingClear(false)} className="text-slate-500">
                انصراف
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onIncrease={() => increaseQty(item.product.id)}
                onDecrease={() => decreaseQty(item.product.id)}
                onRemove={() => removeFromCart(item.product.id)}
              />
            ))}
          </div>
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onContinueShopping={onContinueShopping}
            onCheckout={onCheckout}
          />
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------- Checkout -------------------------------- */
/* Demo-only checkout: no payment gateway, no backend, no persisted PII.
   Reuses cart totals/logic from CartContext instead of recalculating them. */

const PROVINCES = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام",
  "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی",
  "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس",
  "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد",
  "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

// Express delivery is a flat demo surcharge on top of the existing (and
// unmodified) free-shipping rule — it never itself grants free shipping.
const EXPRESS_SURCHARGE = 100000;

const DELIVERY_METHODS = [
  { value: "normal", label: "ارسال عادی", description: "تحویل ۳ تا ۵ روز کاری" },
  { value: "express", label: "ارسال سریع", description: "تحویل ۱ تا ۲ روز کاری" },
];

const PAYMENT_METHODS = [
  { value: "online", label: "پرداخت آنلاین", description: "این بخش صرفاً نمایشی است و به درگاه واقعی متصل نیست." },
  { value: "cod", label: "پرداخت در محل", description: "پرداخت هنگام تحویل کالا به مأمور پست." },
];

// Composes with — rather than duplicates — the base `shipping` value that
// already comes from CartContext (free at/above the threshold, otherwise
// SHIPPING_COST). Express just adds a deterministic surcharge on top.
function getDeliveryCost(method, baseShipping) {
  return method === "express" ? baseShipping + EXPRESS_SURCHARGE : baseShipping;
}

function validateCheckoutForm(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "نام و نام خانوادگی را وارد کنید.";

  const phoneDigits = toEnDigits(form.phone).replace(/[\s-]/g, "");
  if (!phoneDigits) errors.phone = "شماره موبایل را وارد کنید.";
  else if (!/^09\d{9}$/.test(phoneDigits)) errors.phone = "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "ایمیل واردشده معتبر نیست.";
  }

  if (!form.province) errors.province = "استان را انتخاب کنید.";
  if (!form.city.trim()) errors.city = "شهر را وارد کنید.";
  if (!form.address.trim()) errors.address = "آدرس کامل را وارد کنید.";

  const postalDigits = toEnDigits(form.postalCode).replace(/[\s-]/g, "");
  if (!postalDigits) errors.postalCode = "کد پستی را وارد کنید.";
  else if (!/^\d{10}$/.test(postalDigits)) errors.postalCode = "کد پستی باید ۱۰ رقم باشد.";

  return errors;
}

function FormField({ id, label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function fieldClass(hasError) {
  return `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-rose-300 focus:ring-rose-500/30 focus:border-rose-500"
      : "border-slate-200 focus:ring-teal-700/30 focus:border-teal-700"
  }`;
}

function CheckoutSummary({ items, subtotal, shippingCost, total, deliveryLabel }) {
  return (
    <Card className="p-6 h-fit lg:sticky lg:top-24">
      <h2 className="font-extrabold text-slate-900 mb-4">خلاصه سفارش</h2>

      <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
        {items.map((it) => {
          return (
            <div key={it.product.id} className="flex items-center gap-3">
              <ProductImage
                product={it.product}
                className="h-12 w-12 shrink-0 rounded-lg bg-slate-50 border border-slate-100"
                iconClassName="h-5 w-5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{it.product.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {toFa(it.quantity)} × {formatPrice(it.product.price)}
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-900 shrink-0">{formatPrice(it.lineTotal)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2.5 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>جمع کالاها</span>
          <span className="font-medium text-slate-800">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>هزینه ارسال ({deliveryLabel})</span>
          <span className={`font-medium ${shippingCost === 0 ? "text-teal-700" : "text-slate-800"}`}>
            {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="font-bold text-slate-900">مبلغ قابل پرداخت</span>
        <span className="font-extrabold text-lg text-slate-900">{formatPrice(total)}</span>
      </div>
    </Card>
  );
}

function CheckoutSuccess({ order, onContinueShopping, onGoHome }) {
  useEffect(() => {
    window.scrollTo?.({ top: 0 });
  }, []);

  return (
    <Section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-teal-50 flex items-center justify-center mb-5">
            <Check className="h-8 w-8 text-teal-700" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">موفقیت ثبت سفارش نمایشی</h1>
          <p className="mt-2 text-sm text-slate-500">
            این یک سفارش نمایشی است و هیچ پرداخت واقعی انجام نشده است.
          </p>

          <Card className="w-full mt-7 p-5 text-right">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">شماره سفارش</dt>
                <dd dir="ltr" className="font-bold text-slate-900">{order.orderNumber}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">مبلغ سفارش</dt>
                <dd className="font-bold text-slate-900">{formatPrice(order.total)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">روش ارسال</dt>
                <dd className="font-medium text-slate-800">{order.deliveryLabel}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">روش پرداخت</dt>
                <dd className="font-medium text-slate-800">{order.paymentLabel}</dd>
              </div>
            </dl>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 mt-7 w-full">
            <Button variant="primary" onClick={onGoHome} className="flex-1">
              بازگشت به فروشگاه
            </Button>
            <Button variant="secondary" onClick={onContinueShopping} className="flex-1">
              مشاهده محصولات
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Checkout({ onContinueShopping, onGoHome }) {
  const { items, subtotal, shipping: baseShipping, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("normal");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    window.scrollTo?.({ top: 0 });
  }, []);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const markTouched = (key) => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => validateCheckoutForm(form), [form]);
  const isValid = Object.keys(errors).length === 0;
  const shownErrors = useMemo(() => {
    const out = {};
    Object.keys(errors).forEach((k) => {
      if (submitAttempted || touched[k]) out[k] = errors[k];
    });
    return out;
  }, [errors, touched, submitAttempted]);

  const deliveryCost = getDeliveryCost(deliveryMethod, baseShipping);
  const total = subtotal + deliveryCost;
  const canSubmit = isValid && confirmed;

  const selectedDelivery = DELIVERY_METHODS.find((m) => m.value === deliveryMethod);
  const selectedPayment = PAYMENT_METHODS.find((m) => m.value === paymentMethod);

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!isValid || !confirmed) return;

    // Snapshot what the success screen needs BEFORE clearing the cart —
    // clearCart() resets items/subtotal in context immediately after.
    const orderNumber = `HZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderPlaced({
      orderNumber,
      total,
      deliveryLabel: selectedDelivery?.label,
      paymentLabel: selectedPayment?.label,
    });
    clearCart();
    // Customer info (name/phone/email/address) lives only in this
    // component's local state and is discarded on unmount — never written
    // to localStorage or anywhere else.
  };

  if (orderPlaced) {
    return <CheckoutSuccess order={orderPlaced} onContinueShopping={onContinueShopping} onGoHome={onGoHome} />;
  }

  if (items.length === 0) {
    return <EmptyCart onContinueShopping={onContinueShopping} />;
  }

  return (
    <Section className="pt-10 pb-16 md:pb-24">
      <Container>
        <div className="text-center lg:text-right">
          <Eyebrow>تسویه حساب</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">تکمیل سفارش (نمایشی)</h1>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-6">
            <Card className="p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">اطلاعات مشتری</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField id="checkout-fullname" label="نام و نام خانوادگی" error={shownErrors.fullName} className="sm:col-span-2">
                  <input
                    id="checkout-fullname"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    onBlur={() => markTouched("fullName")}
                    placeholder="مثلاً علی محمدی"
                    aria-describedby={shownErrors.fullName ? "checkout-fullname-error" : undefined}
                    className={fieldClass(!!shownErrors.fullName)}
                  />
                </FormField>
                <FormField id="checkout-phone" label="شماره موبایل" error={shownErrors.phone}>
                  <input
                    id="checkout-phone"
                    type="tel"
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    onBlur={() => markTouched("phone")}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    aria-describedby={shownErrors.phone ? "checkout-phone-error" : undefined}
                    className={fieldClass(!!shownErrors.phone)}
                  />
                </FormField>
                <FormField id="checkout-email" label="ایمیل (اختیاری)" error={shownErrors.email}>
                  <input
                    id="checkout-email"
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="example@email.com"
                    aria-describedby={shownErrors.email ? "checkout-email-error" : undefined}
                    className={fieldClass(!!shownErrors.email)}
                  />
                </FormField>
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">آدرس ارسال</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField id="checkout-province" label="استان" error={shownErrors.province}>
                  <select
                    id="checkout-province"
                    value={form.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    onBlur={() => markTouched("province")}
                    aria-describedby={shownErrors.province ? "checkout-province-error" : undefined}
                    className={fieldClass(!!shownErrors.province)}
                  >
                    <option value="">انتخاب استان</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </FormField>
                <FormField id="checkout-city" label="شهر" error={shownErrors.city}>
                  <input
                    id="checkout-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    onBlur={() => markTouched("city")}
                    placeholder="مثلاً کرج"
                    aria-describedby={shownErrors.city ? "checkout-city-error" : undefined}
                    className={fieldClass(!!shownErrors.city)}
                  />
                </FormField>
                <FormField id="checkout-address" label="آدرس کامل" error={shownErrors.address} className="sm:col-span-2">
                  <textarea
                    id="checkout-address"
                    rows={3}
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    onBlur={() => markTouched("address")}
                    placeholder="خیابان، کوچه، پلاک، واحد"
                    aria-describedby={shownErrors.address ? "checkout-address-error" : undefined}
                    className={fieldClass(!!shownErrors.address)}
                  />
                </FormField>
                <FormField id="checkout-postal" label="کد پستی" error={shownErrors.postalCode}>
                  <input
                    id="checkout-postal"
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    onBlur={() => markTouched("postalCode")}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                    aria-describedby={shownErrors.postalCode ? "checkout-postal-error" : undefined}
                    className={fieldClass(!!shownErrors.postalCode)}
                  />
                </FormField>
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">روش ارسال</h2>
              <div className="flex flex-col gap-3">
                {DELIVERY_METHODS.map((m) => {
                  const cost = getDeliveryCost(m.value, baseShipping);
                  const active = deliveryMethod === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setDeliveryMethod(m.value)}
                      className={`w-full text-right rounded-xl border p-4 flex items-center justify-between gap-3 transition-colors ${
                        active ? "border-teal-700 bg-teal-50" : "border-slate-200 hover:border-teal-300"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{m.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ${cost === 0 ? "text-teal-700" : "text-slate-900"}`}>
                        {cost === 0 ? "رایگان" : formatPrice(cost)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">روش پرداخت</h2>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((m) => {
                  const active = paymentMethod === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPaymentMethod(m.value)}
                      className={`w-full text-right rounded-xl border p-4 transition-colors ${
                        active ? "border-teal-700 bg-teal-50" : "border-slate-200 hover:border-teal-300"
                      }`}
                    >
                      <p className="font-bold text-slate-900 text-sm">{m.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">بازبینی نهایی سفارش</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div>
                  <dt className="text-slate-500">گیرنده</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{form.fullName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">موبایل</dt>
                  <dd dir="ltr" className="font-medium text-slate-800 mt-0.5 text-right">{form.phone || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">آدرس</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {form.province || form.city || form.address
                      ? [form.province, form.city, form.address].filter(Boolean).join("، ")
                      : "—"}
                    {form.postalCode ? ` — کد پستی ${form.postalCode}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">روش ارسال</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{selectedDelivery?.label}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">روش پرداخت</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{selectedPayment?.label}</dd>
                </div>
              </dl>

              <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700/40"
                />
                <span className="text-sm text-slate-700">اطلاعات سفارش را تأیید می‌کنم</span>
              </label>

              {submitAttempted && !isValid && (
                <p className="mt-3 text-xs text-rose-600">لطفاً خطاهای فرم را بررسی و برطرف کنید.</p>
              )}

              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full mt-5 ${!canSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                ثبت نهایی سفارش (نمایشی)
              </Button>
              <p className="mt-3 text-xs text-slate-400 text-center">
                این یک سفارش نمایشی است. هیچ پرداخت واقعی انجام نخواهد شد.
              </p>
            </div>
          </div>

          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            shippingCost={deliveryCost}
            total={total}
            deliveryLabel={selectedDelivery?.label}
          />
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------- Root App --------------------------------- */

export default function HomezaHome() {
  return (
    <CartProvider>
      <HomezaApp />
    </CartProvider>
  );
}

function HomezaApp() {
  // No router is available in this environment, so "pages" are modeled as
  // client-side view state within one component tree.
  const [page, setPage] = useState("home");
  const [initialCategory, setInitialCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [navKey, setNavKey] = useState(0);

  const goToProducts = (category) => {
    setInitialCategory(category || null);
    setPage("products");
    setNavKey((k) => k + 1); // forces ProductsPage to remount with fresh filters
    window.scrollTo?.({ top: 0 });
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo?.({ top: 0 });
  };

  const goToProduct = (id) => {
    setSelectedProductId(id);
    setPage("product");
    window.scrollTo?.({ top: 0 });
  };

  const goToCart = () => {
    setPage("cart");
    window.scrollTo?.({ top: 0 });
  };

  const goToCheckout = () => {
    setPage("checkout");
    window.scrollTo?.({ top: 0 });
  };

  return (
    <div dir="rtl" lang="fa" className="min-h-screen bg-white text-slate-900">
      <Header
        page={page}
        onNavigateHome={goHome}
        onNavigateProducts={() => goToProducts(null)}
        onOpenCart={goToCart}
      />
      <main>
        {page === "home" && (
          <>
            <Hero onNavigateProducts={() => goToProducts(null)} />
            <Categories onSelectCategory={goToProducts} />
            <FeaturedProducts onNavigateProducts={() => goToProducts(null)} onOpenProduct={goToProduct} />
            <Promotional onSelectCategory={goToProducts} />
            <WhyHomeza />
            <FinalCTA onNavigateProducts={() => goToProducts(null)} />
          </>
        )}
        {page === "products" && (
          <ProductsPage key={navKey} initialCategory={initialCategory} onOpenProduct={goToProduct} />
        )}
        {page === "product" && (
          <ProductDetails
            productId={selectedProductId}
            onBack={() => goToProducts(null)}
            onOpenProduct={goToProduct}
          />
        )}
        {page === "cart" && (
          <CartView onContinueShopping={() => goToProducts(null)} onCheckout={goToCheckout} />
        )}
        {page === "checkout" && (
          <Checkout onContinueShopping={() => goToProducts(null)} onGoHome={goHome} />
        )}
      </main>
      <Footer
        onNavigateHome={goHome}
        onNavigateProducts={() => goToProducts(null)}
        onSelectCategory={goToProducts}
      />
    </div>
  );
}
