This is an SDK to help develop applications that interact with EBU LIST.

# Usage

`ebu-list-sdk` uses [lerna](https://github.com/lerna/lerna) to manage multiple packages in the same repository..

- Bootstrap:

```
> yarn i
> npx lerna bootstrap
```

- Build:

```
> npx lerna run build
```

- See demos help

```
> cd demos/
> yarn run start
```

- Run the login demo:

```
> cd demos/
> yarn run start login --baseUrl https://list.ebu.io --username demo --password demo
```
