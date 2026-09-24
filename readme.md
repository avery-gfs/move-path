# Move Path (`mvp`)

`mvp` moves or renames a file using a relative path, without making you repeat
its directory path or file extension.

## Rename a File

```bash
mvp foo/bar/notes.txt readme.md
```

`foo/bar/notes.txt` becomes `foo/bar/readme.md`

## Use Existing File Extension

```bash
mvp foo/bar/notes.txt readme
```

`foo/bar/notes.txt` becomes `foo/bar/readme.txt`

## Move a File

```bash
mvp foo/bar/notes.txt ../
```

`foo/bar/notes.txt` becomes `foo/readme.txt`

## Install Tool

```bash
npm install avery-gfs/move-path
```

## Notes

- `mvp` refuses to overwrite an existing target.
- The command prints the final target path after a successful rename.
