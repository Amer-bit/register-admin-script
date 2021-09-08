# installing packages

```
npm install
```

# Building the project

```
npm run build
```

## Commands Example 
**Note:** You should be inside dist directory

### Adding admin

```
node index.js --op add --email "example@example.com" --password "123456" --username "newUser"
```

### Delete admin/admins

```
node index.js --op delete --emails "example1@example.com" "example2@example.com" "example3@example.com"
```

### Reset password

```
node index.js --op reset --email "example@example.com" --password "strongPassword"
```