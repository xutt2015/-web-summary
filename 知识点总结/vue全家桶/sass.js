 1、CSS 功能拓展
	1）嵌套规则
	2）父选择器&
	3）嵌套属性
		.funky {
		  font: {
		    family: fantasy;
		    size: 30em;
		    weight: bold;
		  }
		}
	4）占位符选择器 %：必须通过 @extend 指令调用
2、注释 /* */ 与 //
  前者会被完整输出到编译后的 CSS 文件中，而后者则不会
  将 ! 作为多行注释的第一个字符表示在压缩输出模式下保留这条注释并输出到 CSS 文件中，通常用于添加版权信息。
  插值语句 (interpolation) 也可写进多行注释中输出变量值
    $version: "1.2.3";//变量
	/* This CSS is generated by My Snazzy Framework version #{$version}. */
	编译为 /* This CSS is generated by My Snazzy Framework version 1.2.3. */
3、SassScript
	1）Interactive Shell 可以在命令行中测试 SassScript 的功能。sass -i
	2）变量 $
	   a）声明：$width: 5em;
			  调用：#main {
								 width: $width;
							}
		 b）变量支持块级作用域，变量只在其作用域内有效。可通过!global将局部变量转化为全局变量
	3）数据类型（7种）
		a）字符串，有引号字符串与无引号字符串，"foo", 'bar', baz；
		   注意：使用 #{}时，有引号字符串将被编译为无引号字符串，这样便于在 mixin 中引用选择器名
    b）数字，1, 2, 13, 10px
    c）布尔型，true, false
    d）空值，null
    e）颜色，blue, #04a3f9, rgba(255,0,0,0.5)
    f）数组 (list)，用空格或逗号作分隔符，1.5em 1em 0 2em, Helvetica, Arial, sans-serif；
	     nth 函数可以直接访问数组中的某一项；
	     join 函数可以将多个数组连接在一起；
	     append 函数可以在数组中添加新值；
	     @each 指令能够遍历数组中的每一项。
    g）maps, 相当于 JavaScript 的 object，(key1: value1, key2: value2)
4、运算
   每种数据类型都支持==和!=，圆括号可以影响运算顺序
   1）数字运算支持 + - * / %和关系运算 <, >, <=, >= 
   2）颜色值运算：颜色间加法；和数字算数运算；相同透明度间颜色才能运算，通过 opacify 或 transparentize调整透明度；
							    使用 ie_hex_str 函数将颜色转化为 IE 滤镜要求的格式
   3）字符串运算：+用于连接字符串，最后字符串格式由 + 左侧字符串格式决定
   4）布尔运算：and or 以及 not 运算
   5）数组不支持任何运算方式，只能使用 list functions 控制。
5、函数
   Sass 函数允许使用关键词参数；
   p { color: hsl(0, 100%, 50%); }可以写成
   p { color: hsl($hue: 0, $saturation: 100%, $lightness: 50%); }
   
6、其他：1）插值语句 #{}  2）父选择器&  
         3)变量的结尾添加 !default;如果变量已经被赋值，不会再被重新赋值，但是如果变量还没有被赋值，则会被赋予新的值。
	         注意：变量是 null 空值时将视为未被 !default 赋值。
7、@import
  1)@import 寻找 Sass 文件并将其导入，但在以下情况下，@import 仅作为普通的 CSS 语句，不会导入任何 Sass 文件。
	   1)文件拓展名是 .css；
		 2)文件名以 http:// 开头；
	   3)文件名是 url()；
		 4)@import 包含 media queries。
	2)Sass 允许同时导入多个文件:@import "rounded-corners", "text-shadow";
	3)导入文件也可以使用 #{ } 插值语句，只能作用于 CSS 的 url()。但不是通过变量动态导入 Sass 文件。
	4）如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线
	5）嵌套 @import。注意不可以在混合指令 (mixin) 或控制指令 (control directives) 中嵌套 @import。
			#main { @import "example";}
8、@media允许其在 CSS 规则中嵌套
		.sidebar {
		  width: 300px;
		  @media screen and (orientation: landscape) {
		    width: 500px;
		  }
		}
8、@extend继承
	1）会避免无谓的重复，.seriousError.seriousError 将编译为 .seriousError；
	   删除不能匹配任何元素的选择器（比如 #main#footer ）
	2）可以延伸复杂的选择器 ，比如 .special.cool，a:hover 或者 a.user[href^="http://"] 等
	3）多重延伸：同一个选择器可以延伸给多个选择器
	4）继续延伸：当一个选择器延伸给第二个后，可以继续将第二个选择器延伸给第三个
	5）选择器列：暂时不可以将选择器列 (Selector Sequences)，比如 .foo .bar 或 .foo + .bar，延伸给其他元素，但是，却可以将其他元素延伸给选择器列
9、@at-root、 @at-root (without: ...) 、@at-root (with: ...)
						@media print {
							.parent {
							  .page {
							    width: 8in;
							    @at-root (without: media) {
							      color: red;
							    }
							  }
						  }
						}
		编译为：@media print {
						  .parent .page {
						    width: 8in;
						  }
						}
						.page {//注意不需要.parent并去除了media
						  color: red;
						}
10、其他@
	1）@debug:调试指令打印出sassscript表达式的值到标准错误输出流
	2）@warn：警告指令打印出sassscript表达式的值到标准错误输出流
	3）@error：错误指令抛出一个sassscript表达式的值作为一个致命的错误，包括一个漂亮的堆栈跟踪。
11、控制指令
	1）@if  @else if  @else
	2）@for  
			@for $i from 1 through 3 {
			  .item-#{$i} { width: 2em * $i; }
			}
	3）@each:$var in <list>
	4）@while
			$i: 6;
			@while $i > 0 {
			  .item-#{$i} { width: 2em * $i; }
			  $i: $i - 2;
			}
12、混合指令@mixin:用于定义可重复使用的样式，避免了使用无语意的 class
    引用混合样式 @include
    1)带参数的混合指令：类似于函数
    2)向混合样式中导入内容 
				@mixin apply-to-ie6-only {
				  * html {
				    @content;
				    color: white;
				  }
				}
				@include apply-to-ie6-only {
				  #logo {
				    background-image: url(/logo.gif);、、放入content处
				  }
				}
				编译为
				* html #logo {
				  background-image: url(/logo.gif);
				  color: white;
				}
    3)简写：@mixin 可以用 = 表示，而 @include 可以用 + 表示
13、函数指令@function   @return
14、输出格式
    1）:nested  Nested （嵌套）样式是 Sass 默认的输出格式，能够清晰反映 CSS 与 HTML 的结构关系。选择器与属性等单独占用一行，缩进量与 Sass 文件中一致，每行的缩进量反映了其在嵌套规则内的层数。
    2）:expanded  Expanded 输出更像是手写的样式，选择器、属性等各占用一行，属性根据选择器缩进，而选择器不做任何缩进。
    3）:compact  Compact 输出方式比起上面两种占用的空间更少，每条 CSS 规则只占一行，包含其下的所有属性
		4）:compressed  Compressed 输出方式删除所有无意义的空格、空白行、以及注释，力求将文件体积压缩到最小，同时也会做出其他调整，比如会自动替换占用空间最小的颜色表达方式。



常用函数：
   1）颜色函数：
	   a)RGB颜色函数
				rgb($red,$green,$blue)：根据红、绿、蓝三个值创建一个颜色；
				rgba($red,$green,$blue,$alpha)：根据红、绿、蓝和透明度值创建一个颜色；
				red($color)：从一个颜色中获取其中红色值；
				green($color)：从一个颜色中获取其中绿色值；
				blue($color)：从一个颜色中获取其中蓝色值；
				mix($color-1,$color-2,[$weight])：把两种颜色混合在一起。//$weight合并的比例，默认值为50%，其取值范围是0~1之间。
     b)HSL颜色函数
				hsl($hue,$saturation,$lightness)：通过色相（hue）、饱和度(saturation)和亮度（lightness）的值创建一个颜色；
				hsla($hue,$saturation,$lightness,$alpha)：通过色相（hue）、饱和度(saturation)、亮度（lightness）和透明（alpha）的值创建一个颜色；
				hue($color)：从一个颜色中获取色相（hue）值；
				saturation($color)：从一个颜色中获取饱和度（saturation）值；
				lightness($color)：从一个颜色中获取亮度（lightness）值；
			 常用：
				adjust-hue($color,$degrees)：通过改变一个颜色的色相值，创建一个新的颜色；//通常这个度数值是在-360deg至360deg之间，当然了可以是百分数
				lighten($color,$amount)：通过改变颜色的亮度值，让颜色变亮，创建一个新的颜色；//$amount百分比
				darken($color,$amount)：通过改变颜色的亮度值，让颜色变暗，创建一个新的颜色；
				saturate($color,$amount)：通过改变颜色的饱和度值，让颜色更饱和，从而创建一个新的颜色
				desaturate($color,$amount)：通过改变颜色的饱和度值，让颜色更少的饱和，从而创建出一个新的颜色；
				grayscale($color)：将一个颜色变成灰色，相当于desaturate($color,100%);
				complement($color)：返回一个补充色，相当于adjust-hue($color,180deg);
				invert($color)：反回一个反相色，红、绿、蓝色值倒过来，而透明度不变。
		 c）Opacity函数
				alpha($color) /opacity($color)：获取颜色透明度值；
				rgba($color, $alpha)：改变颜色的透明度值；
				opacify($color, $amount) / fade-in($color, $amount)：使颜色更不透明；对已有颜色的透明度做一个加法运算
				transparentize($color, $amount) / fade-out($color, $amount)：使颜色更加透明。对已有颜色的透明度做一个减法运算
   2）字符串函数：
	      unquote($string)：删除字符串中的引号；
        quote($string)：给字符串添加引号。
   3）数字函数：
				percentage($value)：将一个不带单位的数转换成百分比值；
				round($value)：将数值四舍五入，转换成一个最接近的整数；
				ceil($value)：将大于自己的小数转换成下一位整数；
				floor($value)：将一个数去除他的小数部分；
				abs($value)：返回一个数的绝对值；
				min($numbers…)：找出几个数值之间的最小值；
				max($numbers…)：找出几个数值之间的最大值。
	 4）数组list函数
				length($list)：返回一个列表的长度值；
				nth($list, $n)：返回一个列表中指定的某个标签值
				join($list1, $list2, [$separator])：将两个列给连接在一起，变成一个列表；//comma逗号 space空格
				append($list1, $val, [$separator])：将某个值放在列表的最后；
				zip($lists…)：将几个列表结合成一个多维的列表；
				index($list, $value)：返回一个值在列表中的位置值。
	 5）Introspection函数（判断型函数）
	      type-of($value)：返回一个值的类型
				unit($number)：返回一个值的单位；
				unitless($number)：判断一个值是否带有单位。不带单位返回的值为true，带单位返回的值为false
				comparable($number-1, $number-2)：判断两个值是否可以做加、减和合并
	 6）三元条件函数（Miscellaneous） if($condition,$if-true,$if-false) 例：if(true,1px,2px)
