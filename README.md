# indent-level

A indent level analyzer and visualizer.

## Install

TODO:

## Usage

#### Command

```
indent-level test/simple.txt
```

test/simple.txt
```
level0
   level1
     level2
level0
level0
       level3
              level4
```
#### Result

```
1:0 level0 |      |
2:1 |  level1     |
3:2 |  | level2   |
4:0 level0 |      |
5:0 level0 |      |
6:3 |  | | level3 |
7:4 |  | | |      level4
```


#### Format

```
1:0 level0 |      |
⋀ ⋀  ⋀
| |  |
| |  +- Text
| +---- Indent level
+------ Line number
```

## License

MIT