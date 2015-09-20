# indent-level

A indent level analyzer and visualizer.

### WIP.

```
indent-level ./input.txt
```

input.txt
```
level0
   level1
     level2
level0
level0
       level3
```


```
1:0 level0|  |
2:1 |   level1
3:2 |   | level2
4:0 level0|  |
5:0 level0|  |
6:3 |   | |  level3
```

```
1:0|level0|  |
^ ^  ^
| |  |
| |  +- Text
| +---- Indent level
+------ Line number
```