import { RouterProvider } from "@tanstack/react-router";
import { router } from "./config/router";

import './styles.css';

function App() {
  // useEffect(() => {
  //   fetch("http://localhost:5000")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // }, []);

  return <RouterProvider router={router} />;
}

export default App;
