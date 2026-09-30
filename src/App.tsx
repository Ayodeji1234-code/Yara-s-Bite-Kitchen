
import { useMemo, useState } from "react";
import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  MessageCircle,
} from "lucide-react";
import { menuItems, type MenuItem } from "./data/menu";
import type { CartItem } from "./types";
import MenuCard from "./components/MenuCard";
import "./App.css";

const WHATSAPP_NUMBER = "2348127141355";
const TAKEAWAY_PRICE = 200;

const categories = [
  "All",
  "Rice Dishes",
  "Pasta & Noodles",
  "Protein",
  "Sides",
  "Pastries",
];

function App() {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [cartOpen, setCartOpen] =
    useState(false);

  // Takeaway
  const [takeawayQuantity, setTakeawayQuantity] =
    useState(0);

  // Customer details
  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [deliveryLocation, setDeliveryLocation] =
    useState("");

  const [specificLocation, setSpecificLocation] =
    useState("");

  const [packingInstructions, setPackingInstructions] =
    useState("");

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return menuItems;
    }

    return menuItems.filter(
      (item) =>
        item.category === activeCategory
    );
  }, [activeCategory]);

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const takeawayTotal =
    takeawayQuantity * TAKEAWAY_PRICE;

  const grandTotal =
    cartTotal + takeawayTotal;

  /*
   * Pastries do not require takeaway packs.
   * All other current menu categories require
   * a takeaway pack.
   */
  function requiresTakeaway(item: MenuItem) {
    return item.category !== "Pastries";
  }

  /*
   * Checks whether the current cart contains
   * at least one item that requires takeaway.
   */
  function cartRequiresTakeaway() {
    return cart.some((cartItem) => {
      const menuItem = menuItems.find(
        (menuItem) =>
          menuItem.id === cartItem.id
      );

      return menuItem
        ? requiresTakeaway(menuItem)
        : false;
    });
  }

  function addToCart(
    item: MenuItem,
    optionName?: string,
    price?: number
  ) {
    if (price === undefined) return;

    /*
     * Only meals require takeaway packs.
     * Pastries can be added directly.
     */
    if (
      requiresTakeaway(item) &&
      takeawayQuantity === 0
    ) {
      alert(
        "Please select your takeaway pack before adding this meal to your order."
      );

      return;
    }

    const existingItem = cart.find(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.option === optionName
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.option === optionName
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + 1,
              }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          option: optionName,
          price,
          quantity: 1,
        },
      ]);
    }
  }

  function increaseQuantity(index: number) {
    setCart(
      cart.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(index: number) {
    setCart(
      cart
        .map((item, i) =>
          i === index
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  }

  function clearCart() {
    setCart([]);
    setTakeawayQuantity(0);
  }

  function increaseTakeaway() {
    setTakeawayQuantity(
      takeawayQuantity + 1
    );
  }

  function decreaseTakeaway() {
    setTakeawayQuantity(
      Math.max(
        0,
        takeawayQuantity - 1
      )
    );
  }

  function sendToWhatsApp() {
    if (cart.length === 0) {
      alert(
        "Please add at least one food item to your cart."
      );

      return;
    }

    /*
     * Only require takeaway when the cart contains
     * an item that needs one.
     */
    if (
      cartRequiresTakeaway() &&
      takeawayQuantity === 0
    ) {
      alert(
        "Please select at least one takeaway pack for your meal."
      );

      return;
    }

    if (!customerName.trim()) {
      alert("Please enter your name.");

      return;
    }

    if (!phone.trim()) {
      alert(
        "Please enter your phone number."
      );

      return;
    }

    if (!deliveryLocation) {
      alert(
        "Please select your delivery area."
      );

      return;
    }

    if (!specificLocation.trim()) {
      alert(
        "Please enter your specific delivery location."
      );

      return;
    }

    if (!packingInstructions.trim()) {
      alert(
        "Please explain how you would like your order to be packed."
      );

      return;
    }

    const orderLines = cart
      .map((item) => {
        const option = item.option
          ? ` (${item.option})`
          : "";

        const subtotal =
          item.price * item.quantity;

        return `${item.quantity}x ${item.name}${option} — ₦${subtotal.toLocaleString()}`;
      })
      .join("\n");

    const takeawaySection =
      takeawayQuantity > 0
        ? `${takeawayQuantity} × ₦${TAKEAWAY_PRICE.toLocaleString()} — ₦${takeawayTotal.toLocaleString()}`
        : "None";

    const message = `Hello Yara's Bite Kitchen 👋

I'd like to place an order.

━━━━━━━━━━━━━━
ORDER
━━━━━━━━━━━━━━
${orderLines}

TAKEAWAY PACKS:
${takeawaySection}

FOOD TOTAL: ₦${cartTotal.toLocaleString()}
TAKEAWAY TOTAL: ₦${takeawayTotal.toLocaleString()}

TOTAL: ₦${grandTotal.toLocaleString()}

━━━━━━━━━━━━━━
CUSTOMER DETAILS
━━━━━━━━━━━━━━
Name: ${customerName.trim()}
Phone: ${phone.trim()}

Delivery Area: ${deliveryLocation}
Specific Location: ${specificLocation.trim()}

━━━━━━━━━━━━━━
PACKING INSTRUCTIONS
━━━━━━━━━━━━━━
${packingInstructions.trim()}

Please send me the account details for payment.

Thank you!`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <img
              src="/logo.jpg"
              alt="Yara's Bite Kitchen"
            />
          </div>

          <div>
            <h1>YARA'S BITE</h1>
            <span>Kitchen</span>
          </div>

        </div>

        <button
          className="cart-button"
          onClick={() =>
            setCartOpen(true)
          }
        >
          <ShoppingBag size={20} />

          <span>Cart</span>

          {cartCount > 0 && (
            <b>{cartCount}</b>
          )}
        </button>

      </header>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <p className="eyebrow">
            FRESH • DELICIOUS • HOMEMADE
          </p>

          <h2>
            Delicious meals.
            <br />
            Made fresh for you.
          </h2>

          <p className="hero-text">
            From everyday meals to
            tasty treats, enjoy freshly
            prepared food made to
            satisfy your cravings.
          </p>

          <div className="hero-actions">

            <button
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Menu
            </button>

            <button
              className="hero-secondary"
              onClick={() =>
                setCartOpen(true)
              }
            >
              View Cart
            </button>

          </div>

        </div>

        <div className="hero-image">

          <img
            src="/images/menu-flyer.jpg"
            alt="Yara's Bite meals"
          />

        </div>

      </section>

      {/* DELIVERY BANNER */}
      <section className="delivery-banner">

        <div>

          <strong>
            Delivery Available
          </strong>

          <p>
            Ago-Iwoye • Oru •
            Ijebu-Igbo
          </p>

        </div>

        <MessageCircle size={28} />

      </section>

      {/* MENU */}
      <main
        id="menu"
        className="menu-section"
      >

        <div className="section-heading">

          <p className="eyebrow">
            OUR MENU
          </p>

          <h2>
            What are you craving?
          </h2>

          <p>
            Select a takeaway pack for
            meals, or order snacks and
            pastries without one.
          </p>

        </div>

        {/* TAKEAWAY SECTION */}
        <section className="takeaway-section">

          <div className="takeaway-info">

            <p className="eyebrow">
              FOR MEALS
            </p>

            <h3>
              Takeaway Pack
            </h3>

            <p>
              Select takeaway packs when
              ordering meals. Snacks and
              pastries don't require one.
            </p>

            <strong>
              ₦
              {TAKEAWAY_PRICE.toLocaleString()}{" "}
              per pack
            </strong>

          </div>

          <div className="takeaway-controls">

            <button
              type="button"
              onClick={
                decreaseTakeaway
              }
              disabled={
                takeawayQuantity === 0
              }
              aria-label="Remove takeaway pack"
            >
              <Minus size={18} />
            </button>

            <span>
              {takeawayQuantity}
            </span>

            <button
              type="button"
              onClick={
                increaseTakeaway
              }
              aria-label="Add takeaway pack"
            >
              <Plus size={18} />
            </button>

          </div>

        </section>

        {/* TAKEAWAY INFORMATION */}
        {takeawayQuantity === 0 && (
          <p className="takeaway-warning">
            Takeaway packs are required
            for meals. Snacks and
            pastries can be ordered
            without a pack.
          </p>
        )}

        {/* CATEGORY FILTER */}
        <div className="category-scroll">

          {categories.map(
            (category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "category active"
                    : "category"
                }
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}

        </div>

        {/* MENU ITEMS */}
        <div className="menu-grid">

          {filteredItems.map(
            (item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={addToCart}
              />
            )
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer>

        <div className="footer-brand">

          <div className="brand-icon">
            <img
              src="/logo.jpg"
              alt="Yara's Bite Kitchen logo"
            />
          </div>

          <div>

            <strong>
              YARA'S BITE
            </strong>

            <p>
              Delicious meals.
              Unforgettable bites.
            </p>

          </div>

        </div>

        <p>
          ©{" "}
          {new Date().getFullYear()}{" "}
          Yara's Bite Kitchen.
        </p>

      </footer>

      {/* CART OVERLAY */}
      {cartOpen && (

        <div
          className="overlay"
          onClick={() =>
            setCartOpen(false)
          }
        >

          <aside
            className="cart-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CART HEADER */}
            <div className="cart-header">

              <div>

                <p className="eyebrow">
                  YOUR ORDER
                </p>

                <h2>
                  Your Cart
                </h2>

              </div>

              <div className="cart-header-actions">

                {cart.length > 0 && (
                  <button
                    className="clear-cart-button"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                )}

                <button
                  className="close-button"
                  onClick={() =>
                    setCartOpen(false)
                  }
                  aria-label="Close cart"
                >
                  <X />
                </button>

              </div>

            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (

              <div className="empty-cart">

                <ShoppingBag
                  size={42}
                />

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add something
                  delicious from
                  the menu.
                </p>

              </div>

            ) : (

              <>

                {/* CART ITEMS */}
                <div className="cart-items">

                  {cart.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="cart-item"
                        key={`${item.id}-${item.option}`}
                      >

                        <div className="cart-item-info">

                          <strong>
                            {item.name}
                          </strong>

                          {item.option && (
                            <span>
                              {
                                item.option
                              }
                            </span>
                          )}

                          <small>
                            ₦
                            {item.price.toLocaleString()}{" "}
                            each
                          </small>

                        </div>

                        <div className="quantity">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                index
                              )
                            }
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus
                              size={14}
                            />
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                index
                              )
                            }
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus
                              size={14}
                            />
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* TAKEAWAY SUMMARY */}
                {takeawayQuantity > 0 && (
                  <div className="takeaway-summary">

                    <div>

                      <strong>
                        Takeaway Packs
                      </strong>

                      <span>
                        {takeawayQuantity}{" "}
                        × ₦
                        {TAKEAWAY_PRICE.toLocaleString()}
                      </span>

                    </div>

                    <strong>
                      ₦
                      {takeawayTotal.toLocaleString()}
                    </strong>

                  </div>
                )}

                {/* TOTALS */}
                <div className="cart-total">

                  <span>
                    Food Total
                  </span>

                  <strong>
                    ₦
                    {cartTotal.toLocaleString()}
                  </strong>

                </div>

                {takeawayQuantity > 0 && (
                  <div className="cart-total">

                    <span>
                      Takeaway
                    </span>

                    <strong>
                      ₦
                      {takeawayTotal.toLocaleString()}
                    </strong>

                  </div>
                )}

                <div className="cart-total grand-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₦
                    {grandTotal.toLocaleString()}
                  </strong>

                </div>

                {/* DELIVERY DETAILS */}
                <div className="customer-form">

                  <h3>
                    Delivery Details
                  </h3>

                  {/* NAME */}
                  <div className="form-field">

                    <label htmlFor="customer-name">
                      Your Name *
                    </label>

                    <input
                      id="customer-name"
                      type="text"
                      placeholder="Enter your name"
                      value={
                        customerName
                      }
                      onChange={(e) =>
                        setCustomerName(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* PHONE */}
                  <div className="form-field">

                    <label htmlFor="customer-phone">
                      Phone Number *
                    </label>

                    <input
                      id="customer-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* DELIVERY AREA */}
                  <div className="form-field">

                    <label htmlFor="delivery-area">
                      Delivery Area *
                    </label>

                    <select
                      id="delivery-area"
                      value={
                        deliveryLocation
                      }
                      onChange={(e) =>
                        setDeliveryLocation(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select delivery area
                      </option>

                      <option value="Ago-Iwoye">
                        Ago-Iwoye
                      </option>

                      <option value="Oru">
                        Oru
                      </option>

                      <option value="Ijebu-Igbo">
                        Ijebu-Igbo
                      </option>

                    </select>

                  </div>

                  {/* SPECIFIC LOCATION */}
                  <div className="form-field">

                    <label htmlFor="specific-location">
                      Specific Delivery
                      Location *
                    </label>

                    <textarea
                      id="specific-location"
                      placeholder="Tell us exactly where the food should be delivered. Include street, hostel, house number, landmark, etc."
                      value={
                        specificLocation
                      }
                      onChange={(e) =>
                        setSpecificLocation(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* PACKING INSTRUCTIONS */}
                  <div className="form-field">

                    <label htmlFor="packing-instructions">
                      How should your
                      order be packed? *
                    </label>

                    <textarea
                      id="packing-instructions"
                      placeholder="Explain how you want your order packed. E.g. rice and chicken together, separate packs, sauce separately, etc."
                      value={
                        packingInstructions
                      }
                      onChange={(e) =>
                        setPackingInstructions(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* WHATSAPP */}
                  <button
                    className="whatsapp-button"
                    onClick={
                      sendToWhatsApp
                    }
                  >
                    <MessageCircle
                      size={20}
                    />

                    Send Order to
                    WhatsApp
                  </button>

                  <p className="payment-note">
                    After sending your
                    order, we'll send
                    the payment/account
                    details to you on
                    WhatsApp.
                  </p>

                </div>

              </>

            )}

          </aside>

        </div>

      )}

    </div>
  );
}

export default App;

