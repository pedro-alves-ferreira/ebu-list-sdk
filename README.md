This is an SDK to help develop applications that interact with EBU LIST.

# Usage

`ebu-list-sdk` uses [lerna](https://github.com/lerna/lerna) to manage multiple npm packages in the same repository. It has been tested with `nodejs` v12.

- Bootstrap:

```
> npm i
> npx lerna bootstrap
```

- Build:

```
> npx lerna run build
```

- Run the login demo:

```
> cd demos/
> npm start login -- -b <server> -u <user> -p <pass>
```
