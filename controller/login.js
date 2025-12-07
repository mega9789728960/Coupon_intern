// loginController.js


const demoUser = {
  userId: "u_demo",
  email: "hire-me@anshumat.org",
  password: "HireMe@2025!",
  userTier: "NEW",
  country: "IN",
  lifetimeSpend: 1200,
  ordersPlaced: 2,
};

export function demoLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  if (email === demoUser.email && password === demoUser.password) {
    const { password, ...userData } = demoUser; // remove password from response
    return res.status(200).json({ success: true, user: userData });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}
