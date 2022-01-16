# Forum Frontend with React

We're going to use React with typescript to build our forum frontend.

#Setup

## Install nvm

If you haven't already make sure you have nvm installed.

## Use Node 16

Open up the terminal and cd to the folder you keep your projects in.

    nvm use 16

## Create the Project

In the same terminal window run

    npx create-react-app ./forum_frontend --template typescript

Now you can open the project up in your IDE of choice.

## Jetbrains IDE

If you're using a Jetbrains IDE(Phpstorm, Webstorm, IntelliJ) you
should install the Prettier plugin from Jetbrains. Once you do that
go into preferences (command+,).
Then go to Languages and Frameworks >
JavaScript > Prettier and turn on "On Reformat Code" Option.

Once we have Prettier setup code formatting will follow the rules
we set.

## Install eslint

Run

    npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

## Install Prettier

Prettier will help auto format code. Install it using

    npm install --save-dev --save-exact prettier

    echo {}> .prettierrc.json

## Update Prettier Config

Open up .prettierrc.json file

    {
        "trailingComma": "es5",
        "semi": true,
        "useTabs": false,
        "bracketSpacing": false,
        "arrowParens": "always",
        "printWidth": 120,
        "tabWidth": 4
    }

## Create Prettier Ignore File

    create a file called .prettierignore

now add these to it

    node_modules
    build
    .idea

## Install Tool to Make Prettier and ESLint Work Together

    npm install --save-dev eslint-config-prettier

    npm install --save-dev eslint-plugin-prettier

## Create ESLint Ignore File

create a file called .eslintignore

now add these to it

    node_modules
    build
    .idea

## Create ESLint Config File

create a file called .eslintrc.json

    {
        "parser": "@typescript-eslint/parser",
        "plugins": ["@typescript-eslint"],
        "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
        "rules": {
            "prettier/prettier": ["error"]
        }
    }

## Run Prettier Write

This will format your project based on the prettier rules.
You can run this whenever you want to format project files

    npx prettier -w .

## Install React Router

    npm install react-router-dom@6

## Install Classnames

    npm install classnames

## Install Sass

    npm i sass

## Install css reset

    npm i the-new-css-reset

Then inside of App.tsx import

    import "the-new-css-reset/css/reset.css"

## Update .tsconfig

Add these to the compilerOptions section

    "noImplicitAny": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true

# Optional Installs

## Install FontAwesome

If you have your own icons or just don't want to use
icons then this step is not necessary.

    npm i --save @fortawesome/fontawesome-svg-core
    npm install --save @fortawesome/free-solid-svg-icons
    npm install --save @fortawesome/react-fontawesome
    npm install --save @fortawesome/free-brands-svg-icons
    npm install --save @fortawesome/free-regular-svg-icons

## Install Luxon

Luxon is used for date/times. If you intend to display times
it can be a helpful library

    npm i luxon

    npm i @types/luxon

## Google Fonts

If you want to try some different fonts go to https://fonts.google.com/

You can paste the link code it gives you into the public/index.html file
