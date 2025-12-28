import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

/* ======= СТОРІНКИ (поки прості заглушки) ======= */

function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gold-300">
        Luxury BeautyShop
      </h1>
      <p className="text-gray-300 text-lg max-w-xl">
        Преміальна косметика. Стиль Black & Gold. Доставка по всій Україні.
      </p>

      <div className="flex gap-4">
        <Link to="/shop" className="btn-gold px-6 py-3">
          Перейти в каталог
        </Link>
        <Link
          to="/cart"
          className="border border-gold-500/40 rounded-xl px-6 py-3 hover:bg-gold-500/10"
        >
          Кошик
        </Link>
      </div>
    </div>
  );
}

function ShopPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gold-300 mb-4">
        Каталог товарів
      </h1>
      <p className="text-gray-400">
        Тут буде список товарів з бекенду (API).
      </p>
    </div>
  );
}

function CartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gold-300 mb-4">
        Кошик
      </h1>
      <p className="text-gray-400">
        Кошик поки порожній.
      </p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-gold-300 mb-4">
        Вхід
      </h1>
      <input placeholder="Email" className="w-full mb-3" />
      <input placeholder="Пароль" type="password" className="w-full mb-4" />
      <button className="btn-gold w-full py-2">
        Увійти
      </button>
    </div>
  );
}

/* ======= LAYOUT ======= */

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gold-300">
          BeautyShop
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link to="/shop" className="hover:text-gold-300">
            Каталог
          </Link>
          <Link to="/cart" className="hover:text-gold-300">
            Кошик
          </Link>
          <Link to="/login" className="hover:text-gold-300">
            Вхід
          </Link>
        </nav>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-8 py-10">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-8 py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Luxury BeautyShop
      </footer>
    </div>
  );
}

/* ======= APP ======= */

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
