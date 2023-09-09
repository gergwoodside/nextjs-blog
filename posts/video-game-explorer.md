---
title: "Building a Responsive Game Catalog App: A Journey of Learning"
date: "2023-09-09"
---

In the world of software development, building your own applications is not just a great way to showcase your skills but also an excellent opportunity to learn new technologies and improve your existing ones. In this blog post, I'll take you through my journey of creating a responsive game catalog app and highlight the various technologies I utilized and the valuable lessons I learned along the way.

## Setting Up the Project

I decided to use Vite for this project due to its speed and simplicity. To create the project, I executed the following command in the terminal:

```plaintext
npm create vite@4.1.0
```

This command initiated the setup process, and I followed the prompts to create the project structure.

## Installing Chakra UI

With the project set up, I needed a reliable UI library, and Chakra UI was my choice. I followed the installation instructions provided on the Chakra UI website to integrate it into my project seamlessly.

## Creating a Responsive Layout

My goal was to create a responsive layout with a navigation bar, a side bar, and a main content area. I utilized the Chakra UI Grid component to achieve this layout.

```javascript
import { Grid, GridItem, Show } from "@chakra-ui/react";

function App() {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      {/* Content Goes Here */}
    </Grid>
  );
}

export default App;
```

Inside the Grid, I had different Grid Items, and I used the "Show" component to display the aside area only on large screens.

## Building the Navigation Bar

The first component I created was the navigation bar. I organized my components into folders, and I initiated the components folder and created a new file called `Navbar.tsx`. To layout the items horizontally, I used the Chakra UI `HStack` component, and I imported and used Chakra's `Image` component for displaying the logo.

```javascript
import logo from "../assets/logo.webp";
import { HStack, Image } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <HStack>
      <Image src={logo} boxSize="60px" />
    </HStack>
  );
};
```

## Implementing Dark Mode

Creating a dark mode was an essential feature of my app. I began by creating a new file in the `src` folder called `theme.ts` and configured the initial color mode.

```javascript
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
};

const theme = extendTheme({ config });

export default theme;
```

I then integrated this theme into my app by importing it in `main.tsx` and wrapping the app with `ChakraProvider`. I also added the `<ColorModeScript>` tag to ensure the selected theme is stored in local storage, providing a persistent dark mode experience.

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "./App";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
```

## Building the Color Mode Switch

To enable users to toggle between light and dark modes, I created a new component called `ColorModeSwitch.tsx`. I used the Chakra UI `useColorMode` hook to control the color mode, and I added properties to the switch and set the color scheme to make it visually appealing.

```javascript
import { HStack, Switch, Text, useColorMode } from "@chakra-ui/react";
import React from "react";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack>
      <Switch
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
        colorScheme="green"
      />
      <Text>Dark Mode</Text>
    </HStack>
  );
};

export default ColorModeSwitch;
```

## Fetching Games from rawg.io

To populate my game catalog, I used an API from rawg.io and employed Axios to send HTTP requests. I created a new folder called `src/services` and added a file called `api-client.ts` to store the API's base URL and authentication key.

```javascript
import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "12a00fa08c4447efa276d487e9b81513",
  },
});
```

Next, I created a component called `GameGrid.tsx` to fetch and display the games. I used the `useEffect` hook to send the fetch request to the backend.

```javascript
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { Text } from "@chakra-ui/react";

interface Game {
  id: number;
  name: string;
}

interface FetchGamesResponse {
  count: number;
  results: Game[];
}

const GameGrid = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<FetchGamesResponse>("/games")
      .then((res) => setGames(res.data.results))
      .catch((err) => setError(err.message));
  });

  return (
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </>
  );
};

export default GameGrid;
```

## Creating a Custom Hook for Fetching Games

To improve code organization and adhere to best practices, I created a custom hook called `useGames` to retrieve the games. This hook encapsulates the API call logic and separates it from the component.

```javascript
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

interface Game {
    id: number;
    name: string;
}

interface FetchGamesResponse {
    count: number;
    results: Game[];
}

const useGames = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
      const controller = new AbortController();

      apiClient
        .get<FetchGamesResponse>("/games", { signal: controller.signal })
        .then((res) => setGames(res.data.results))
        .catch((err) => setError(err.message));

      return () => controller.abort();
    }, []);

    return { games, error }
}

export default useGames;
```

I then updated the `GameGrid` component to use this custom hook.

```javascript
import { Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";

const GameGrid = () =>
```
