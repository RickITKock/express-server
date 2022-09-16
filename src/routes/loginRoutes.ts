import { NextFunction, Request, Response, Router } from "express";

const router = Router();

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

router.get("/login", (req: Request, res: Response) => {
  res.send(`
    <form method='POST'>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password"><br>
        <button type="submit">Login</button>
    </form>
    `);
});

router.post("/login", (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;

  if (email) {
    // res.send(email + password);
    req.session = { loggedIn: true };
    res.redirect(`/`);
  } else {
    res.send("You must enter a valid email");
  }
});

function requireAuth(req: RequestWithBody, res: Response, next: NextFunction) {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send("Not authorized");
}

router.get("/", (req: RequestWithBody, res: Response) => {
  console.log(req.session);
  if (req.session && req.session.loggedIn) {
    res.send(`Logged in`);
  } else {
    res.send(`Not logged in`);
  }
});

router.get("/logout", (req: RequestWithBody, res: Response) => {
  if (req.session && req.session.loggedIn) {
    req.session.loggedIn = false;
    res.redirect("/login");
  }
});

router.get("/protected", requireAuth, (req: RequestWithBody, res: Response) => {
  res.send(`Welcome`);
});

export { router };
