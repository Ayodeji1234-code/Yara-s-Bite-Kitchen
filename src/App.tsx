
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
  "Snacks",
  "Yummy Cakes",
  "Fries",
  "Grills",
  "Drinks",
  "Creamy Shawarma",
];

/*
 * ONLY these categories require takeaway packs.
 */
const TAKEAWAY_CATEGORIES = [
  "Rice Dishes",
  "Pasta & Noodles",
  "Protein",
];

type PendingItem = {
  item: MenuItem;
  optionName?: string;
  price: number;
};

function App() {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [cartOpen, setCartOpen] =
    useState(false);

  /*
   * Takeaway pack quantity.
   * There is no maximum.
   */
  const [takeawayQuantity, setTakeawayQuantity] =
    useState(0);

  /*
   * Item waiting for a takeaway pack
   * before it can be added.
   */
  const [pendingItem, setPendingItem] =
    useState<PendingItem | null>(null);

  /*
   * Screen notification.
   */
  const [notification, setNotification] =
    useState("");

  /*
   * Customer details.
   */
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

  /*
   * Filter menu.
   */
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return menuItems;
    }

    return menuItems.filter(
      (item) =>
        item.category === activeCategory
    );
  }, [activeCategory]);

  /*
   * Total number of food items in cart.
   */
  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /*
   * Food subtotal.
   */
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  /*
   * Determine whether a menu item
   * requires a takeaway pack.
   */
  function requiresTakeaway(
    item: MenuItem
  ) {
    return TAKEAWAY_CATEGORIES.includes(
      item.category
    );
  }

  /*
   * Calculate the number of takeaway
   * packs required by food currently
   * in the cart.
   */
  const requiredTakeawayQuantity =
    cart.reduce((total, cartItem) => {
      const menuItem = menuItems.find(
        (menuItem) =>
          menuItem.id === cartItem.id
      );

      if (
        menuItem &&
        requiresTakeaway(menuItem)
      ) {
        return (
          total + cartItem.quantity
        );
      }

      return total;
    }, 0);

  /*
   * Takeaway cost.
   */
  const takeawayTotal =
    takeawayQuantity * TAKEAWAY_PRICE;

  /*
   * Final order total.
   */
  const grandTotal =
    cartTotal + takeawayTotal;

  /*
   * Show notification on the screen.
   */
  function showNotification(
    message: string
  ) {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 4000);
  }

  /*
   * Actually add the item to the cart.
   */
  function addItemToCart(
    item: MenuItem,
    optionName?: string,
    price?: number
  ) {
    if (price === undefined) {
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

    setPendingItem(null);
  }

  /*
   * Add food to cart.
   *
   * Rice Dishes, Pasta & Noodles and
   * Protein require takeaway packs.
   */
  function addToCart(
    item: MenuItem,
    optionName?: string,
    price?: number
  ) {
    if (price === undefined) {
      return;
    }

    /*
     * Food that does NOT require takeaway
     * can always be added.
     */
    if (!requiresTakeaway(item)) {
      addItemToCart(
        item,
        optionName,
        price
      );

      showNotification(
        `${item.name} added to your cart.`
      );

      return;
    }

    /*
     * If there are no takeaway packs,
     * don't add the food yet.
     */
    if (takeawayQuantity === 0) {
      setPendingItem({
        item,
        optionName,
        price,
      });

      showNotification(
        `Takeaway required — Please select a takeaway pack before adding ${item.name}.`
      );

      return;
    }

    /*
     * Every additional quantity of
     * qualifying food needs another pack.
     */
    const requiredAfterAdding =
      requiredTakeawayQuantity + 1;

    /*
     * Not enough takeaway packs.
     */
    if (
      takeawayQuantity <
      requiredAfterAdding
    ) {
      showNotification(
        `You need another takeaway pack before adding more ${item.name}.`
      );

      return;
    }

    /*
     * Enough packs — add the food.
     */
    addItemToCart(
      item,
      optionName,
      price
    );

    showNotification(
      `${item.name} added to your cart.`
    );
  }

  /*
   * Increase food quantity from cart.
   */
  function increaseQuantity(
    index: number
  ) {
    const cartItem = cart[index];

    if (!cartItem) {
      return;
    }

    const menuItem = menuItems.find(
      (item) =>
        item.id === cartItem.id
    );

    /*
     * Qualifying food needs an additional
     * takeaway pack for every additional unit.
     */
    if (
      menuItem &&
      requiresTakeaway(menuItem)
    ) {
      const requiredAfterIncrease =
        requiredTakeawayQuantity + 1;

      if (
        takeawayQuantity <
        requiredAfterIncrease
      ) {
        showNotification(
          "Please select another takeaway pack before increasing this item's quantity."
        );

        return;
      }
    }

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

  /*
   * Decrease food quantity.
   */
  function decreaseQuantity(
    index: number
  ) {
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
          (item) =>
            item.quantity > 0
        )
    );
  }

  /*
   * Clear the entire order.
   */
  function clearCart() {
    setCart([]);
    setTakeawayQuantity(0);
    setPendingItem(null);
  }

  /*
   * Add takeaway pack.
   *
   * There is NO maximum.
   */
  function increaseTakeaway() {
    const newQuantity =
      takeawayQuantity + 1;

    setTakeawayQuantity(
      newQuantity
    );

    /*
     * If a food item was waiting for
     * takeaway selection, add it now.
     */
    if (
      pendingItem &&
      newQuantity >= 1
    ) {
      addItemToCart(
        pendingItem.item,
        pendingItem.optionName,
        pendingItem.price
      );

      showNotification(
        `${pendingItem.item.name} added to your cart.`
      );
    }
  }

  /*
   * Remove takeaway pack.
   *
   * Cannot go below the amount
   * required by the current food.
   */
  function decreaseTakeaway() {
    if (
      takeawayQuantity <=
      requiredTakeawayQuantity
    ) {
      showNotification(
        `You need at least ${requiredTakeawayQuantity} takeaway pack${
          requiredTakeawayQuantity !== 1
            ? "s"
            : ""
        } for your current food order.`
      );

      return;
    }

    setTakeawayQuantity(
      takeawayQuantity - 1
    );
  }

  /*
   * Send complete order to WhatsApp.
   */
  function sendToWhatsApp() {
    /*
     * Cart validation.
     */
    if (cart.length === 0) {
      showNotification(
        "Please add at least one item to your cart."
      );

      return;
    }

    /*
     * Takeaway validation.
     */
    if (
      takeawayQuantity <
      requiredTakeawayQuantity
    ) {
      showNotification(
        `Please select ${requiredTakeawayQuantity} takeaway pack${
          requiredTakeawayQuantity > 1
            ? "s"
            : ""
        } for your order.`
      );

      return;
    }

    /*
     * Customer name.
     */
    if (!customerName.trim()) {
      showNotification(
        "Please enter your name."
      );

      return;
    }

    /*
     * Phone.
     */
    if (!phone.trim()) {
      showNotification(
        "Please enter your phone number."
      );

      return;
    }

    /*
     * Delivery area.
     */
    if (!deliveryLocation) {
      showNotification(
        "Please select your delivery area."
      );

      return;
    }

    /*
     * Specific delivery location.
     */
    if (!specificLocation.trim()) {
      showNotification(
        "Please enter your specific delivery location."
      );

      return;
    }

    /*
     * Packing instructions are compulsory.
     */
    if (
      !packingInstructions.trim()
    ) {
      showNotification(
        "Please explain how you would like your order to be packed."
      );

      return;
    }

    /*
     * Format food items.
     */
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

    /*
     * Format takeaway section.
     */
    const takeawaySection =
      takeawayQuantity > 0
        ? `${takeawayQuantity} × ₦${TAKEAWAY_PRICE.toLocaleString()} — ₦${takeawayTotal.toLocaleString()}`
        : "None";

    /*
     * WhatsApp message.
     */
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

      {/* =========================
          SCREEN NOTIFICATION
      ========================== */}

      {notification && (
        <div className="screen-notification">

          <div className="notification-content">

            <strong>
              Yara's Bite Kitchen
            </strong>

            <p>
              {notification}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setNotification("")
            }
            aria-label="Close notification"
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">

            <img
              src="/logo.jpg"
              alt="Yara's Bite Kitchen"
            />

          </div>

          <div>

            <h1>
              YARA'S BITE
            </h1>

            <span>
              Kitchen
            </span>

          </div>

        </div>

        <button
          type="button"
          className="cart-button"
          onClick={() =>
            setCartOpen(true)
          }
        >

          <ShoppingBag size={20} />

          <span>
            Cart
          </span>

          {cartCount > 0 && (
            <b>
              {cartCount}
            </b>
          )}

        </button>

      </header>

      {/* =========================
          HERO / HOME SCREEN
      ========================== */}

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
              type="button"
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
              type="button"
              className="hero-secondary"
              onClick={() =>
                setCartOpen(true)
              }
            >
              View Cart
            </button>

          </div>

        </div>

        {/* FLYER — KEPT FROM YOUR ORIGINAL HOME PAGE */}

        <div className="hero-image">

          <img
            src="/images/menu-flyer.jpg"
            alt="Yara's Bite meals"
          />

        </div>

      </section>

      {/* =========================
          DELIVERY BANNER
      ========================== */}

      <section className="delivery-banner">

        <div>

          <strong>
            Delivery Available
          </strong>

          <p>
            Ago-Iwoye • Oru • Ijebu-Igbo
          </p>

        </div>

        <MessageCircle size={28} />

      </section>

      {/* =========================
          MENU
      ========================== */}

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
            Choose from our rice dishes,
            pasta, proteins, sides, pastries,
            snacks, cakes, fries, grills,
            drinks and creamy shawarma.
          </p>

        </div>

        {/* =========================
            TAKEAWAY SECTION
        ========================== */}

        {(requiredTakeawayQuantity > 0 ||
          pendingItem ||
          takeawayQuantity > 0) && (

          <>
            <section className="takeaway-section">

              <div className="takeaway-info">

                <p className="eyebrow">
                  TAKEAWAY
                </p>

                <h3>
                  Takeaway Pack
                </h3>

                <p>
                  ₦
                  {TAKEAWAY_PRICE.toLocaleString()}
                  {" "}per pack
                </p>

                {requiredTakeawayQuantity >
                  0 && (

                  <small>
                    Your current food order
                    requires{" "}
                    {requiredTakeawayQuantity}{" "}
                    pack
                    {requiredTakeawayQuantity >
                    1
                      ? "s"
                      : ""}.
                  </small>

                )}

                {pendingItem && (

                  <div className="takeaway-warning">

                    Please select at least
                    one takeaway pack to
                    add{" "}
                    <strong>
                      {pendingItem.item.name}
                    </strong>
                    {" "}to your order.

                  </div>

                )}

              </div>

              <div className="takeaway-controls">

                <button
                  type="button"
                  onClick={
                    decreaseTakeaway
                  }
                  disabled={
                    takeawayQuantity <=
                    requiredTakeawayQuantity
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

            {takeawayQuantity <
              requiredTakeawayQuantity && (

              <p className="takeaway-warning">

                Please select{" "}
                {requiredTakeawayQuantity -
                  takeawayQuantity}{" "}
                more takeaway pack
                {requiredTakeawayQuantity -
                  takeawayQuantity >
                1
                  ? "s"
                  : ""}.

              </p>

            )}

          </>

        )}

        {/* =========================
            CATEGORY FILTER
        ========================== */}

        <div className="category-scroll">

          {categories.map(
            (category) => (

              <button
                key={category}
                type="button"
                className={
                  activeCategory ===
                  category
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

        {/* =========================
            MENU ITEMS
        ========================== */}

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

      {/* =========================
          FOOTER
      ========================== */}

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
          © {new Date().getFullYear()}{" "}
          Yara's Bite Kitchen.
        </p>

      </footer>

      {/* =========================
          CART OVERLAY
      ========================== */}

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
                    type="button"
                    className="clear-cart-button"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>

                )}

                <button
                  type="button"
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

                <ShoppingBag size={42} />

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add something delicious
                  from the menu.
                </p>

              </div>

            ) : (

              <>

                {/* =====================
                    CART ITEMS
                ====================== */}

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
                              {item.option}
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
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                index
                              )
                            }
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                index
                              )
                            }
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* =====================
                    TAKEAWAY SUMMARY
                ====================== */}

                {takeawayQuantity > 0 && (

                  <div className="takeaway-summary">

                    <div>

                      <strong>
                        Takeaway Packs
                      </strong>

                      <span>
                        {takeawayQuantity} × ₦
                        {TAKEAWAY_PRICE.toLocaleString()}
                      </span>

                    </div>

                    <strong>
                      ₦
                      {takeawayTotal.toLocaleString()}
                    </strong>

                  </div>

                )}

                {/* =====================
                    TOTALS
                ====================== */}

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

                {/* =====================
                    DELIVERY DETAILS
                ====================== */}

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
                      onChange={(event) =>
                        setCustomerName(
                          event.target.value
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
                      onChange={(event) =>
                        setPhone(
                          event.target.value
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
                      onChange={(event) =>
                        setDeliveryLocation(
                          event.target.value
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
                      Specific Delivery Location *
                    </label>

                    <textarea
                      id="specific-location"
                      placeholder="Tell us exactly where the food should be delivered. Include street, hostel, house number, landmark, etc."
                      value={
                        specificLocation
                      }
                      onChange={(event) =>
                        setSpecificLocation(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  {/* PACKING INSTRUCTIONS */}

                  <div className="form-field">

                    <label htmlFor="packing-instructions">
                      How should your order be packed? *
                    </label>

                    <textarea
                      id="packing-instructions"
                      placeholder="Explain how you want your order packed. E.g. rice and chicken together, separate packs, sauce separately, etc."
                      value={
                        packingInstructions
                      }
                      onChange={(event) =>
                        setPackingInstructions(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  {/* WHATSAPP */}

                  <button
                    type="button"
                    className="whatsapp-button"
                    onClick={
                      sendToWhatsApp
                    }
                  >

                    <MessageCircle
                      size={20}
                    />

                    Send Order to WhatsApp

                  </button>

                  <p className="payment-note">

                    After sending your order,
                    we'll send the payment/account
                    details to you on WhatsApp.

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
