const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const form = document.getElementById("leadForm");
const result = document.getElementById("result");

const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/tv6v82p3vxarh5y85s8t58ago5wpptl5";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  result.textContent = "Отправляем заявку...";

  const formData = new FormData(form);

  const selectedProduct = formData.get("product") || "";

  const lead = {
    date: new Date().toLocaleString("ru-RU"),
    page: "client_landing",

    name: formData.get("name") || "",
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",

    product: selectedProduct,
    interest: selectedProduct,

    comment: formData.get("comment") || "",

    telegramUsername: tg?.initDataUnsafe?.user?.username || "Не определён",
    telegramId: tg?.initDataUnsafe?.user?.id || "",

    source: "telegram_mini_app"
  };

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lead)
    });

    if (!response.ok) {
      throw new Error("Ошибка webhook");
    }

    result.textContent = "Заявка успешно отправлена. Мы скоро свяжемся с вами.";
    form.reset();

    if (tg) {
      tg.HapticFeedback.notificationOccurred("success");
    }

  } catch (error) {
    console.error("Ошибка:", error);
    result.textContent = "Ошибка соединения. Попробуйте позже.";
  }
});
