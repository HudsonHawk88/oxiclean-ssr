import type {RoutListProps} from "../interfaces/main";
import Home from "../pages/home/Home.tsx";
import Szolgaltatasok from "../pages/szolgaltatasok/Szolgaltatasok.tsx";
// import Referenciak from "../pages/referenciak/Referenciak.tsx";
import Elerhetosegek from "../pages/elerhetosegek/Elerhetosegek.tsx";
import NotFound from "../pages/notfound/NotFound.tsx";

export const routeList: RoutListProps[] = [
    { path: "/", index: true, element: Home, text: "Főoldal", linkable: true },
    { path: "/szolgaltatasok", index: false, element: Szolgaltatasok, text: "Szolgáltatások", linkable: true  },
    // { path: "/referenciak", index: false, element: Referenciak, text: "Referenciák", linkable: true  },
    { path: "/elerhetosegek", index: false, element: Elerhetosegek, text: "Elérhetőségek", linkable: true  },
    { path: "*", index: false, element: NotFound, text: "", linkable: false  },
]