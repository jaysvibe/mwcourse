window.BASICS_HTML = `
<div class="crumb"><a href="#/home">首页</a> / 图纸基础</div>
<p class="eyebrow">基础课 · 建议先学这一页</p>
<h1>工程图纸基础：一张图上的每个符号</h1>
<p class="lead">先别急着算 K、A、δ。工程图纸是一套“缩写语言”：Ø、R、t、h₀、H7、Ra、⊥ 这些符号，各自代表一个可以测量、可以验收的参数。这一页先把图纸读法讲透，最后第 8 节才把数字代进公式。</p>

<div class="callout key">
  <div class="co-t">这一页怎么用</div>
  <p>第一次看，按顺序读第 1–6 节，建立“读图顺序”；第 7 节做一遍练习；第 8 节再看公式。以后拿到任何一张机械图，回来看第 2–5 节的表即可。工程符号上百个，这一页覆盖波纹管和普通机械件最常用的部分；遇到生僻符号，查 GB/T 4457/4458，或直接问我。</p>
</div>

<h2>一、读图的顺序：先看什么，后看什么</h2>
<p>新手最容易犯的错，是从左上角开始“看画”。正确的顺序是<strong>先找身份，再看形状，再量尺寸，最后读要求</strong>：</p>
<ol>
  <li><strong>标题栏</strong>：这零件叫什么、图号多少、什么材料、比例多少、第几版。</li>
  <li><strong>视图</strong>：主视图、俯视图、剖视图、局部放大图，先在脑子里建立三维形状。</li>
  <li><strong>尺寸</strong>：定形尺寸（多长、多粗）、定位尺寸（孔在哪）、总体尺寸（最大外廓）。</li>
  <li><strong>符号</strong>：Ø、R、□、M、t、C、公差、形位公差、表面粗糙度。</li>
  <li><strong>技术要求</strong>：材料状态、热处理、表面处理、焊接、无损检测、清洁度。</li>
  <li><strong>明细栏</strong>：装配图里每个件号、数量、材料、标准件。</li>
  <li><strong>核对</strong>：尺寸链是否闭合、有没有带括号的参考尺寸、版本是不是最新。</li>
</ol>
<div class="callout warn">
  <div class="co-t">报价前最容易漏的一步</div>
  <p>先看标题栏的<strong>版本号</strong>。客户口头说“按上次的图”，实际附件可能是 v3；壁厚、端部、热处理任意一项改了，价格和交期都会变。报价单上要写清“依据图号 + 版本”。</p>
</div>

<h2>二、图纸的骨架</h2>

<h3>2.1 图幅与标题栏</h3>
<p>图幅是纸张大小，常用 A3、A4；标题栏一般在右下角，是这张图的“身份证”。</p>
<div class="tbl"><table>
  <thead><tr><th>图幅</th><th>尺寸（mm）</th><th>常见用途</th></tr></thead>
  <tbody>
    <tr><td>A0</td><td>841 × 1189</td><td>大型总图、总装</td></tr>
    <tr><td>A1</td><td>594 × 841</td><td>较大装配图</td></tr>
    <tr><td>A2</td><td>420 × 594</td><td>中型装配图</td></tr>
    <tr><td>A3</td><td>297 × 420</td><td>零件图最常用</td></tr>
    <tr><td>A4</td><td>210 × 297</td><td>简单零件、明细表</td></tr>
  </tbody>
</table></div>
<p>标题栏里每个格子都在回答一个商务或工艺问题：</p>
<div class="tbl"><table>
  <thead><tr><th>字段</th><th>它决定什么</th></tr></thead>
  <tbody>
    <tr><td>零件名称 / 图号</td><td>这是谁，报价和追溯用哪个编号</td></tr>
    <tr><td>材料</td><td>成本、工艺路线、能不能焊、耐不耐蚀</td></tr>
    <tr><td>比例</td><td>图是放大还是缩小；尺寸数字仍是真实值</td></tr>
    <tr><td>版本 / 日期</td><td>你报的是不是最新版</td></tr>
    <tr><td>设计 / 审核 / 批准</td><td>出问题找谁，变更有没有走过评审</td></tr>
    <tr><td>重量</td><td>材料成本、运费、包装</td></tr>
    <tr><td>单位 / 未注公差</td><td>默认单位是 mm；未注公差按哪一级</td></tr>
  </tbody>
</table></div>

<h3>2.2 视图：一张图为什么画好几个“角度”</h3>
<ul>
  <li><strong>主视图</strong>：最能表达零件形状的一面，通常放左上或正中间。</li>
  <li><strong>俯视图、左视图</strong>：从上面、从左面看，和主视图一起构成“三视图”。</li>
  <li><strong>剖视图</strong>：把零件“切开”看内部，剖面线表示被切到的实体；密封槽、内腔、焊缝坡口常靠它。</li>
  <li><strong>局部放大图</strong>：把圆角、波纹、密封槽、焊缝这些太小的地方放大画，比例可能写 5:1。</li>
  <li><strong>轴测图</strong>：立体的“效果图”，只帮助理解形状，<strong>不要在上面量尺寸</strong>。</li>
</ul>

<h3>2.3 比例：图上量出来的不是真实尺寸</h3>
<p>比例 1:1 是原大，1:2 是缩小一半，2:1 是放大一倍。无论比例多少，<strong>尺寸数字永远代表零件的真实尺寸</strong>。图上量 16 mm，比例 1:2，实际是 32 mm；但图上如果标了“32”，就直接读 32，不要乘 2。</p>

<h3>2.4 线型：不同线，不同含义</h3>
<div class="tbl"><table>
  <thead><tr><th>线型</th><th>含义</th><th>常见位置</th></tr></thead>
  <tbody>
    <tr><td>粗实线</td><td>可见轮廓</td><td>零件外形、孔口</td></tr>
    <tr><td>细实线</td><td>尺寸线、尺寸界线、剖面线</td><td>标注区</td></tr>
    <tr><td>虚线</td><td>不可见轮廓</td><td>内部孔、隐藏槽</td></tr>
    <tr><td>点画线</td><td>中心线、对称线</td><td>圆心、轴线</td></tr>
    <tr><td>双点画线</td><td>假想轮廓、相邻件</td><td>装配图、运动极限</td></tr>
    <tr><td>波浪线</td><td>断裂边界</td><td>局部剖、断开画法</td></tr>
  </tbody>
</table></div>

<h3>2.5 基准：尺寸从哪儿量</h3>
<p>基准是尺寸的“起点”。设计基准是设计上选定的面/线/孔，工艺基准是加工时实际装夹的面。两者最好重合；不重合时，尺寸链会多出一环，加工和检测都更容易吵。看到一排尺寸都从同一个面出发，那个面就是基准。</p>

<h2>三、尺寸标注：图纸上最常见的一层</h2>
<p>一个完整尺寸有四个要素：<strong>尺寸界线、尺寸线、箭头、尺寸数字</strong>。数字默认单位是 mm；同一个尺寸不要重复标；尺寸链一般不允许闭合（会互相打架）；带括号的尺寸是<strong>参考尺寸</strong>，不用于验收。</p>

<h3>3.1 先认这些符号</h3>
<div class="tbl"><table>
  <thead><tr><th>符号/写法</th><th>读法</th><th>例子</th><th>注意</th></tr></thead>
  <tbody>
    <tr><td>Ø</td><td>直径</td><td>Ø32</td><td>圆/圆柱的直径，不是半径</td></tr>
    <tr><td>R</td><td>半径</td><td>R5</td><td>圆弧半径；整圆才用 Ø</td></tr>
    <tr><td>SR</td><td>球面半径</td><td>SR10</td><td>球面，不是普通圆弧</td></tr>
    <tr><td>□（方框）</td><td>正方形</td><td>□20</td><td>边长 20 mm 的正方形</td></tr>
    <tr><td>M</td><td>公制螺纹</td><td>M8×1.25</td><td>M8 是公称直径，不是 Ø8 光孔</td></tr>
    <tr><td>t</td><td>厚度（一般图纸）</td><td>t=2</td><td>波纹管图纸里 t 常表示波距，见第 4 节</td></tr>
    <tr><td>C</td><td>倒角</td><td>C1</td><td>1×45° 倒角</td></tr>
    <tr><td>±</td><td>对称偏差</td><td>32±0.1</td><td>上偏差 +0.1，下偏差 −0.1</td></tr>
    <tr><td>°</td><td>角度</td><td>90°</td><td>角度单位</td></tr>
    <tr><td>H7 / g6</td><td>公差带代号</td><td>Ø32H7 / Ø32g6</td><td>H 是基孔制，g 是轴公差带</td></tr>
    <tr><td>( )</td><td>参考尺寸</td><td>(32)</td><td>不用于验收，只作参考</td></tr>
    <tr><td>EQS</td><td>均布</td><td>6×Ø6 EQS</td><td>6 个孔沿圆周均布</td></tr>
    <tr><td>Ra</td><td>表面粗糙度</td><td>Ra 1.6</td><td>单位 μm，数字越小越光滑</td></tr>
  </tbody>
</table></div>

<h3>3.2 公差与配合：为什么图纸上不写“正好 32”</h3>
<p>加工不可能绝对精确，所以图纸给的是<strong>允许范围</strong>。例如 Ø32H7：基本尺寸 32，H7 是孔的公差带；Ø32g6 是轴的公差带。H7/g6 通常形成间隙配合，H7/k6 多为过渡，H7/p6 多为过盈。看到 H7/g6，不要背数字，先判断是<strong>孔</strong>还是<strong>轴</strong>，再查公差表。</p>
<div class="tbl"><table>
  <thead><tr><th>配合</th><th>大致效果</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>H7/g6</td><td>小间隙，能滑动</td><td>导向、滑动轴承</td></tr>
    <tr><td>H7/k6</td><td>过渡，可能微过盈</td><td>定位销、齿轮</td></tr>
    <tr><td>H7/p6</td><td>过盈，压装</td><td>衬套、联轴器</td></tr>
  </tbody>
</table></div>
<div class="callout note">
  <div class="co-t">未注公差不是“没有公差”</div>
  <p>图纸右下角常写“未注公差按 GB/T 1804-m”之类。意思是：没单独标公差的尺寸，也按这个等级验收。报价时如果只看到“±0.1”几个字，先找这句话。</p>
</div>

<h3>3.3 形位公差：方框里的符号</h3>
<p>形位公差控制的是“形状和位置”，不是尺寸大小。常见 14 种，先按五类记：</p>
<ul>
  <li><strong>形状</strong>：直线度、平面度、圆度、圆柱度。</li>
  <li><strong>方向</strong>：平行度 ∥、垂直度 ⊥、倾斜度 ∠。</li>
  <li><strong>位置</strong>：位置度、同轴度 ◎、对称度。</li>
  <li><strong>跳动</strong>：圆跳动、全跳动。</li>
  <li><strong>轮廓</strong>：线轮廓度、面轮廓度。</li>
</ul>
<p>框格一般三格：<strong>符号 | 公差值 | 基准</strong>。例如“⊥ 0.05 A”读作：相对于基准 A，垂直度误差不超过 0.05 mm。没有基准的，多半是形状公差（如圆度）。</p>

<h3>3.4 表面粗糙度：Ra 1.6 到底多光滑</h3>
<p>Ra 是轮廓算术平均偏差，单位 μm。数字越小越光滑、加工越贵：</p>
<div class="tbl"><table>
  <thead><tr><th>Ra（μm）</th><th>大致加工</th><th>典型场合</th></tr></thead>
  <tbody>
    <tr><td>12.5</td><td>粗车/粗铣</td><td>非配合面</td></tr>
    <tr><td>6.3</td><td>半精车</td><td>一般配合面</td></tr>
    <tr><td>3.2</td><td>精车/精铣</td><td>普通密封面</td></tr>
    <tr><td>1.6</td><td>磨/精铰</td><td>滑动配合、O 圈槽</td></tr>
    <tr><td>0.8</td><td>精磨/抛光</td><td>真空密封、精密导向</td></tr>
    <tr><td>0.4 及以下</td><td>研磨/电解抛光</td><td>UHV、光学、半导体</td></tr>
  </tbody>
</table></div>

<h2>四、波纹管图纸的专有参数</h2>
<p>普通机械图的 d、D、t 已经够多，波纹管还多出一套“波形语言”。下面这些来自课本 §2.1.1，是波纹管图纸的核心：</p>
<div class="tbl"><table>
  <thead><tr><th>符号</th><th>名称</th><th>怎么定义</th><th>影响什么</th></tr></thead>
  <tbody>
    <tr><td>d</td><td>内径</td><td>波纹部分最内边缘直径</td><td>通径、流量；k 的分母</td></tr>
    <tr><td>D</td><td>外径</td><td>波纹部分最外边缘直径</td><td>波高、外廓、k 的分子</td></tr>
    <tr><td>t</td><td>波距</td><td>相邻两波同侧对应点的距离</td><td>波数、有效长度、成形难度</td></tr>
    <tr><td>a</td><td>波厚</td><td>外波纹部分轴向最大宽度</td><td>波形角、圆角、应力集中</td></tr>
    <tr><td>h₀</td><td>单层壁厚</td><td>单层材料的厚度</td><td>刚度、承压、疲劳（最关键）</td></tr>
    <tr><td>z</td><td>层数</td><td>管壁由几层材料组成</td><td>多层降刚度、提承压</td></tr>
    <tr><td>n</td><td>波数</td><td>波纹的个数</td><td>柔度、行程、成本</td></tr>
    <tr><td>L₀</td><td>有效长度</td><td>波纹部分的轴向总长</td><td>稳定性、行程</td></tr>
    <tr><td>L</td><td>总长</td><td>含端接的轴向总长</td><td>安装空间、报价长度</td></tr>
    <tr><td>H₁</td><td>波高</td><td>波峰到波谷的径向高度</td><td>与 k 直接相关</td></tr>
    <tr><td>k</td><td>波深系数</td><td>k = D / d</td><td>第一眼判断工艺路线</td></tr>
  </tbody>
</table></div>
<div class="callout warn">
  <div class="co-t">t 的双重身份：最容易读错的参数</div>
  <p>普通图纸里 t 常表示“厚度”；波纹管图纸里 <strong>t 是波距</strong>，壁厚用 <strong>h₀</strong>。看到 t 先看它标在哪儿：标在两个波峰之间就是波距，标在管壁上才是厚度。读错一个 t，波数和有效长度全错，报价也会错。</p>
</div>

<h3>4.1 端部代号：N、W、D、QD、Qd</h3>
<div class="tbl"><table>
  <thead><tr><th>代号</th><th>端部形式</th><th>特点</th></tr></thead>
  <tbody>
    <tr><td>N</td><td>内配合</td><td>端部插入配合件；D₁/L₁ 选大了，成形时容易破裂</td></tr>
    <tr><td>W</td><td>外配合</td><td>工艺性最好，最常用</td></tr>
    <tr><td>D</td><td>封闭底</td><td>一端封底，像“盲管”</td></tr>
    <tr><td>QD</td><td>波峰切断</td><td>在波峰处切断，端部是波峰</td></tr>
    <tr><td>Qd</td><td>波谷切断</td><td>在波谷处切断，端部是波谷</td></tr>
  </tbody>
</table></div>

<h3>4.2 波型：U、C、Ω/S、多层</h3>
<ul>
  <li><strong>U 型</strong>：最常用，位移大、承压一般；加内外加强环可提高承压。</li>
  <li><strong>C 型</strong>：刚度大、灵敏度差，多作密封隔离或挠性连接。</li>
  <li><strong>Ω/S 型</strong>：高压小位移，常见于高压阀门密封隔离。</li>
  <li><strong>多层 U 型</strong>：高压 + 大位移，用多层降低等效刚度、提高承压。</li>
</ul>

<h3>4.3 拿到波纹管图，先算三个比值</h3>
<ol>
  <li><strong>k = D/d</strong>：1.3–1.5 浅波，1.6–1.9 深波，k≥2 液压成形困难，宜考虑焊接。</li>
  <li><strong>h₀/d</strong>：常用 0.0006–0.05；太小承压差，太大则硬。</li>
  <li><strong>L₀/D</strong>：书里要求 L₀≤1.3D；超了要导向或分段，否则容易柱失稳。</li>
</ol>

<h2>五、技术要求：图纸右下角那一段字</h2>
<p>技术要求不是“备注”，是验收条件。客户报价时只说“按图做”，争议往往就出在这一段。</p>

<h3>5.1 材料与状态</h3>
<p>材料要连“状态”一起读：316L 是牌号，固溶、退火、1/2H 是状态；状态不同，强度、硬度、成形性都不同。旧牌号还要换算：1Cr18Ni9Ti≈321，0Cr18Ni9≈304/304L，00Cr17Ni14Mo2≈316L。</p>

<h3>5.2 热处理</h3>
<p>常见有去应力退火、固溶、时效。波纹管冷成形后会有残余应力，去应力能稳定尺寸；固溶能恢复耐蚀性；时效用于沉淀强化合金。看到“固溶+稳定化”“保护气氛”“真空热处理”，要知道这是防氧化、防变形的要求，成本不低。</p>

<h3>5.3 表面处理</h3>
<p>钝化、电解抛光、镀镍、喷涂、发黑。真空/半导体件常用电解抛光，降低放气和颗粒；普通件用钝化即可。图纸会写膜厚、Ra、颜色或盐雾小时数。</p>

<h3>5.4 焊接符号与焊材</h3>
<p>焊接符号一般由<strong>基本符号 + 尺寸 + 辅助符号</strong>组成：焊缝在箭头侧还是非箭头侧、是否全周焊、是否现场焊。焊材要与母材匹配：316L 常用 ER316L；C-22 常用 ERNiCrMo-4。看到“母材 316L、焊材 ERNiCrMo-4”，先别照做，这可能是抄错，也可能是特殊耐蚀要求，必须澄清。</p>

<h3>5.5 无损检测与清洁度</h3>
<ul>
  <li><strong>RT</strong> 射线：看内部气孔、未焊透；<strong>UT</strong> 超声：看内部缺陷；<strong>PT</strong> 渗透：看表面裂纹；<strong>MT</strong> 磁粉：只用于铁磁材料。</li>
  <li><strong>氦检漏</strong>：真空/密封件的关键指标，常写漏率 &lt;1×10⁻⁹ mbar·L/s 这类数值。</li>
  <li><strong>清洁度</strong>：颗粒、油、水分；UHV 件还要清洗、烘烤、包装等级。</li>
</ul>

<h2>六、标题栏与明细栏：报价前必看</h2>
<div class="tbl"><table>
  <thead><tr><th>看到</th><th>要问自己</th></tr></thead>
  <tbody>
    <tr><td>图号 + 版本</td><td>我报的是不是最新版？变更单在哪？</td></tr>
    <tr><td>材料 + 状态</td><td>有没有替代牌号？材料证书要不要 3.1？</td></tr>
    <tr><td>数量</td><td>是单件、样件还是批量？模具/工装摊不摊？</td></tr>
    <tr><td>比例</td><td>图上尺寸是不是真实值？有没有局部放大？</td></tr>
    <tr><td>技术要求</td><td>热处理/表面/焊接/检测，哪一项会推高成本？</td></tr>
    <tr><td>未注公差</td><td>按哪一级验收？要不要全检？</td></tr>
  </tbody>
</table></div>

<h2>七、练习：把这张简化图读一遍</h2>
<p>下图是一根波纹管的简化图，只画了最关键的几个要素。先不看下面的表，自己指一遍：哪个是 D、哪个是 d、哪个是 t、哪个是 h₀、L₀ 从哪量到哪。</p>
<svg viewBox="0 0 720 280" role="img" aria-label="波纹管简化图" style="width:100%;height:auto;border:1px solid var(--line);border-radius:14px;background:var(--panel);margin:14px 0">
  <rect x="40" y="92" width="24" height="76" rx="4" fill="var(--line-2)"/>
  <rect x="656" y="92" width="24" height="76" rx="4" fill="var(--line-2)"/>
  <path d="M64 130 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0 q17.9 -28 35.8 0 q17.9 28 35.8 0" fill="none" stroke="var(--brand)" stroke-width="3"/>
  <line x1="64" y1="230" x2="656" y2="230" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="64" y1="224" x2="64" y2="236" stroke="var(--muted)" stroke-width="1"/>
  <line x1="656" y1="224" x2="656" y2="236" stroke="var(--muted)" stroke-width="1"/>
  <text x="360" y="252" text-anchor="middle" font-size="12" fill="var(--muted)">L₀ 有效长度</text>
  <circle cx="360" cy="68" r="11" fill="var(--accent)"/><text x="360" y="72" text-anchor="middle" font-size="12" fill="#fff">1</text>
  <circle cx="360" cy="192" r="11" fill="var(--accent)"/><text x="360" y="196" text-anchor="middle" font-size="12" fill="#fff">2</text>
  <circle cx="150" cy="96" r="11" fill="var(--blue)"/><text x="150" y="100" text-anchor="middle" font-size="12" fill="#fff">3</text>
  <circle cx="80" cy="150" r="11" fill="var(--blue)"/><text x="80" y="154" text-anchor="middle" font-size="12" fill="#fff">4</text>
  <circle cx="520" cy="96" r="11" fill="var(--brand)"/><text x="520" y="100" text-anchor="middle" font-size="12" fill="#fff">5</text>
  <circle cx="688" cy="150" r="11" fill="var(--brand)"/><text x="688" y="154" text-anchor="middle" font-size="12" fill="#fff">6</text>
</svg>
<div class="tbl"><table>
  <thead><tr><th>编号</th><th>它是什么</th><th>怎么读</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>外径 D</td><td>波峰到波峰的最大直径</td></tr>
    <tr><td>2</td><td>内径 d</td><td>波谷到波谷的最小内径</td></tr>
    <tr><td>3</td><td>波距 t</td><td>相邻两个波峰（同侧）的距离</td></tr>
    <tr><td>4</td><td>单层壁厚 h₀</td><td>管壁材料厚度，不是波距</td></tr>
    <tr><td>5</td><td>波数 n</td><td>数波峰或波谷的个数</td></tr>
    <tr><td>6</td><td>端部 W</td><td>外配合端，工艺性最好</td></tr>
  </tbody>
</table></div>
<details>
  <summary>练习答案（先自己想，再点开）</summary>
  <p>1 = 外径 D；2 = 内径 d；3 = 波距 t；4 = 单层壁厚 h₀；5 = 波数 n；6 = 端部 W。若图上写 Ø32×0.15，表示外径 32 mm、壁厚 0.15 mm；内径不是 32，而是 32 − 2×0.15 = 31.7 mm。</p>
</details>

<h2>八、最后才讲公式：把图纸数字代进去</h2>
<p>现在你已经知道 Ø、D、d、t、h₀ 分别是什么，再来看公式，它就不是“天书”，而是把图纸上的数字代入一个关系。</p>

<h3>8.1 先算金属截面积 A</h3>
<p>把管子横着切开，看到的是圆环，不是实心圆。A 是金属那一圈的面积。</p>
<p><strong>算法一（大圆减小圆）：</strong>外径 D=32，内径 d=32−2×0.15=31.7。外圆面积 = π/4×32² ≈ 804.2 mm²；内圆面积 = π/4×31.7² ≈ 789.2 mm²；A ≈ 804.2−789.2 = <strong>15.0 mm²</strong>。</p>
<p><strong>算法二（薄环展开）：</strong>周长 πD ≈ 100.5 mm，展开成 100.5×0.15 的薄片，A ≈ <strong>15.1 mm²</strong>。两种算法差 0.5%，工程上用 <strong>A≈πDt</strong> 估算就够了。</p>

<h3>8.2 E 和 MPa 是什么</h3>
<p>E 是弹性模量，钢约 2×10⁵ MPa。1 MPa = 1 N/mm²，所以 E = 200,000 N/mm²。“2×10⁵”就是 2 后面 5 个 0，即 200,000。</p>

<h3>8.3 直管刚度 K = E·A/L</h3>
<p>代入：K = 200,000×15÷60。先算分子 200,000×15 = 3,000,000 N；再除以 60 mm，得 <strong>50,000 N/mm</strong>。</p>
<p>单位：N/mm²×mm² = N；N÷mm = N/mm。意思是“每压 1 mm 需要 50,000 N”。压 0.1 mm 就要 5 kN（约 500 公斤）；压 10 mm 要 500 kN（约 50 吨）。直管到不了 10 mm，早就屈曲或焊缝开裂。</p>
<div class="callout key">
  <div class="co-t">公式的顺序</div>
  <p>先认参数（第 4 节）→ 再算面积（8.1）→ 再代材料常数（8.2）→ 最后算 K（8.3）。不要一上来背 K=EA/L；先问 A 是哪一圈、E 的单位是什么，公式才不会代错。</p>
</div>

<h2>九、十个最常见误读</h2>
<ol>
  <li>把 Ø32×0.15 当成 32×0.15 的面积或乘法。</li>
  <li>把波纹管的 t 当壁厚（t 是波距，壁厚是 h₀）。</li>
  <li>按比例在图上量尺寸，忘了数字才是真实值。</li>
  <li>把带括号的参考尺寸当验收尺寸。</li>
  <li>以为没标公差就没有公差，忽略“未注公差”那句话。</li>
  <li>把 Ra 当尺寸公差；Ra 是表面粗糙度。</li>
  <li>把 M8 当成 Ø8 光孔；M 是螺纹。</li>
  <li>把旧牌号 1Cr18Ni9Ti 直接当 316L；两者耐蚀性差很多。</li>
  <li>只看图纸、不看版本，按旧版报价。</li>
  <li>看到“焊材 ERNiCrMo-4 + 母材 316L”不澄清，直接按图做。</li>
</ol>

<div class="callout note">
  <div class="co-t">下一步</div>
  <p>看完这一页，再回第 1 课《波纹管：一根会呼吸的金属管》。第 1 课里的公式会变得可读；如果还有哪个符号不认识，把图发我，我按这张表给你逐项拆。</p>
</div>
`;
