# ESLint Essentials with Nx Workspace

A new software project starts pristine - no code, no projects, no files. However, in just a few days or weeks of development there might be some variations of code syntax and formatting. This may be due to different developer styles, IDEs, text editors, tools, or even scaffolding generators. 

It is much easier to gain control and manage the code syntax and formatting rules with a shared monorepo and Nx Workspace. A new Nx Workspace provides ESLint rules and configuration for all projects within a workspace.

## What Does It Do

The name is the combination of ES and Lint. ESLint provides the ability to analyze (e.g., lint) your EcmaScript or TypeScript code to verify it meets the criteria of specified rules and required syntax. Typically, these tools are automated for the developer and also within a continuous integration (CI) environment.

- ES: EcmaScript
- Lint: the name of a tool that analyzed C code in 1978

Some advantages to using ESLint:

- Less errors in production
- Readable, maintainable and more consistent code
- Fewer discussions about code style and aesthetic choices during code reviews
- Objective measurement of code quality

## ESLint Configuration Cascades

I like that our new Nx Workspace environment provides a *workspace-level* ESLint configuration using the `.eslintrc.json` file. You get this by default when you add/generate a project in the workspace.

> 1. Create a new Nx Workspace: `npx create-nx-workspace workspace --scope-name=angular-architecture `
> 
> 2. Add package to create an Angular application: `yarn add @nrwl/angular@12.3.3 -D`
> 
> 3. Generate a `fuzzy` project that needs linting: `nx g @nrwl/angular:application fuzzy `

When you add a new *project* to the Nx Workspace the CLI will add a new `.eslintrc.json` to the project. This means that the files in the project will use the closest `.eslintrc.json` configuration - if this configuration *extends* other configuration from upstream folders these rules will also be included in the lint evaluation process.

> Adding a `"root": true` to a lower-level configuration will stop the cascade effect of extended rules. This limits the rules to the specific level or project - nice, if you have a custom configuration for a specific use case.

### Project Level ESLint


Each project also contains a configuration for ESLint rules that apply to the *project-level* only using the `overrides` for the lint rules.

What is interesting about the project-level configuration is that it uses JSON `extends` to inherit lint settings from the workspace-level configuration using the `extends` list of `.eslintrc.json` files.

> There is a relationship between the project and the workspace level ESLint configuration files. 

```json
{
  "extends": ["../../.eslintrc.json.json"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "plugin:@nrwl/nx/angular",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "parserOptions": { "project": ["apps/fuzzy/tsconfig.*?.json"] },
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          { "type": "attribute", "prefix": "workspace", "style": "camelCase" }
        ],
        "@angular-eslint/component-selector": [
          "error",
          { "type": "element", "prefix": "workspace", "style": "kebab-case" }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@nrwl/nx/angular-template"],
      "rules": {}
    }
  ]
}
```

## Anatomy of ESLint File

| Property       | Description                                                                                                                                                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| extends        | a string that specifies a configuration (1. path to a file, 2. [`eslint:recommended`](https://eslint.org/docs/rules/#:~:text=The%20%22extends%22%3A%20%22eslint,which%20have%20a%20wrench%20below.), or `eslint:all`)                                                                                                             |
| ignorePatterns | Tell ESLint to ignore specific files and directories using [ignorePatterns](https://eslint.org/docs/user-guide/configuring/ignoring-code#ignorepatterns-in-config-files) in your config files. ignorePatterns patterns follow the same rules as .eslintignore. Please see the the .eslintignore file documentation to learn more. |
| overrides      | used in lower-level configurations to override specific rules that apply to the project or folder location of the `.eslintrc.json` file.                                                                                                                                                                                          |
|                |                                                                                                                                                                                                                                                                                                                                   |
|                |                                                                                                                                                                                                                                                                                                                                   |

## Lint Your Angular Application

Here is a simple example of a linting issue in our *fuzzy* application. Some developers or teams may not want the following issues in the code base.

- a `console.log` statement exists.
- there is an empty `ngOnInit` method.

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fuzzy';

  constructor() {
    console.log('Happy component here.');
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
```

Run the CLI `lint` command to evaluate the code syntax using the rules in the current `.eslintrc.json` configuration for the project and workspace.

> run: `nx lint`

The output:

```ts
nx run fuzzy:lint 
Linting "fuzzy"...
app.component.ts
14:3  error  Lifecycle methods should not be empty  @angular-eslint/no-empty-lifecycle-method

✖ 1 problem (1 error, 0 warnings)
Lint errors found in the listed files.
———————————————————————————————————————————————
NX   ERROR  Running target "fuzzy:lint" failed
Failed tasks:
- fuzzy:lint
```

Notice that the `@angular-eslint/no-empty-lifecycle-method` ESLint rule is an *error* for the empty method in the component file.

## ESLint on Save

Add the following to your Visual Studio Code `settings.json` file

```json
{
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.alwaysShowStatus": true
}
```

## Automated Formatting

Linting and code formatting can work together. Note, linting is focused on syntax rules based ont the target language (e.g., TypeScript, HTML, etc.). While formatting is concerned with other things like using single or double quotes. Formatting is important because it is part of the *consistency* and *readability* factors of your code base.

```json
{
  "bracketSpacing": true,
  "printWidth": 166,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false
}
```

Configure Visual Studio Code to automatically format the entire file or modified code. Open your user settings and configure the `Format` section to save.

> There is more to integrate Prettier with ESLint [Integrate ESLint with Prettier](https://nickymeuleman.netlify.app/blog/automagically-lint).

## Where Are My Linting Rules

Using Nx provides some really nice out-of-the-box configuration and setup for ESLint. There is a set of packages installed for the workspace that provide rules, plugins, and configuration for ESLint to *just work*. Here are the `devDependencies` that enable ESLint to work in the Nx Workspace.

```json
"@angular-eslint/eslint-plugin-template": "~12.0.0",
"@angular-eslint/eslint-plugin": "~12.0.0",
"@angular-eslint/template-parser": "~12.0.0",
"@nrwl/eslint-plugin-nx": "12.3.3",
"@typescript-eslint/eslint-plugin": "4.19.0",
"@typescript-eslint/parser": "4.19.0",
"eslint-config-prettier": "8.1.0",
"eslint-plugin-cypress": "^2.10.3",
"eslint": "7.22.0",
```

Below is an example of a lint error. It contains information that tells where the rule is coming from. The `no-empty-lifecycle-method` rule that was used to evaluate the component file is located in the `@angular-eslint` package.

> `error  Lifecycle methods should not be empty  @angular-eslint/no-empty-lifecycle-method`

I really like that we can install a package that contains a set of ready to use rules. You can take the default settings and you can override any rules where you want to fine tune the configuration (i.e., off, warn, error).

## Resources

- [Github.com: nx-eslint repository](https://github.com/buildmotion/nx-eslint)
- [Configuring ESLint](https://eslint.org/docs/user-guide/configuring/#extending-configuration-files)
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint#readme)
- [Angular ESLint with Nx Workspace](https://github.com/angular-eslint/angular-eslint#usage-with-nx-monorepos)
- [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint)
- [What Is a Linter? Here’s a Definition and Quick-Start Guide](https://www.testim.io/blog/what-is-a-linter-heres-a-definition-and-quick-start-guide/#:~:text=The%20term%20linter%20comes%20from,he%20worked%20at%20Bell%20Labs.)