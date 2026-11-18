const stageSource='阶段测试原题 · 独立推导';
const stageChoice=(id,title,description,options,key,result,explanation)=>({
 id:`stage-${id}`,title:`第 ${id} 题 ${title}`,kind:'选择题',description,options,key,result,source:stageSource,
 steps:[step('判断依据',explanation)]
});
groups.push({title:'阶段测试',topic:'选择题与简答题',items:[
 stageChoice(1,'齐纳二极管','齐纳二极管起稳压作用时，处于什么状态？',['反向击穿','反向截止','正向导通','正向死区'],'区分正向导通和反向稳压。','A．反向击穿','在规定的反向电流范围内，管电压近似保持在稳压值。串联电阻用于限流。'),
 stageChoice(2,'运放工作区','集成运放一般分为哪两个工作区？',['线性与非线性','正反馈与负反馈','虚短与虚断','同相与反相'],'工作区描述输出响应。','A．线性与非线性','理想运放在线性工作时可用虚短；输出饱和时不能继续令两输入端等电位。'),
 stageChoice(3,'半导体掺杂','N 型半导体与 P 型半导体分别掺入几价杂质？',['五价、三价','五价、五价','三价、三价','三价、五价'],'先想多数载流子从哪里来。','A．五价、三价','在硅中掺五价施主杂质，多出电子，形成 N 型；掺三价受主杂质，产生空穴，形成 P 型。'),
 stageChoice(4,'温度对 BJT 的影响','温度升高时，BJT 的输入特性曲线和输出特性曲线分别向哪个方向移动？',['左移、上移','左移、下移','右移、上移','右移、下移'],'在相同基极电流下比较。','A．左移、上移','同一基极电流所需的基射电压下降，输入曲线左移；按教材常用模型，同一基极电流的集电极电流上升，输出曲线上移。'),
 stageChoice(5,'电压放大器的电阻','对于电压放大电路，输入电阻和输出电阻分别越怎样越好？',['大、小','大、小','小、小','小、大'],'分别从信号源和负载看。','输入电阻大，输出电阻小。原卷 A、B 相同。','高输入电阻可减少对信号源的负载；低输出电阻可减小接入负载时的电压跌落。'),
 {id:'stage-6',title:'第 6 题 理想二极管（简答 1）',kind:'简答题',image:'stage-diode',source:stageSource,
  description:'判断图中理想二极管的导通状态，并求输出电压 U<sub>o</sub>。',
  key:'先假设截止，比较阳极和阴极电位。',result:'二极管导通，U<sub>o</sub> = −3 V。',
  steps:[step('从电源极性读出节点电压','以下端为参考地。两个电源长线都在下方，二极管阳极为 −3 V，3 kΩ 电阻下端为 −9 V。'),
  step('检验截止假设','若截止，电阻无电流，阴极为 −9 V。阳极比阴极高 6 V，和截止假设矛盾。'),
  step('求输出并验算',`理想导通压降为零，输出等于阳极电位。${equation(`I_D = ${fr('−3 V − (−9 V)','3 kΩ')} = 2 mA`)}电流方向从阳极到阴极，导通假设成立。`)]},
 {id:'stage-7',title:'第 7 题 多输入运放（简答 2）',kind:'简答题',image:'stage-opamp',source:stageSource,
  description:'由理想运放构成的运算电路如图，求 v<sub>o</sub> 与 v<sub>i1</sub>、v<sub>i2</sub>、v<sub>i3</sub> 的关系。',
  key:'先在同相端分压，再在反相端列节点电流方程。',result:'v<sub>o</sub> = 2.5v<sub>i1</sub> − 2v<sub>i2</sub> − 2v<sub>i3</sub>',
  steps:[step('求同相端电压',`v<sub>i1</sub> 经两个 2R 分压，得 v<sub>+</sub> = v<sub>i1</sub>/2。输出经 2R 回到反相端；在线性区，设 v<sub>x</sub> = v<sub>−</sub> = v<sub>+</sub>。`),
  step('列反相端电流方程',`${equation(`${fr('vₓ − vᵢ₂','R')} + ${fr('vₓ − vᵢ₃','R')} + ${fr('vₓ − vₒ','2R')} = 0`)}两边乘 2R 并移项：v<sub>o</sub> = 5v<sub>x</sub> − 2v<sub>i2</sub> − 2v<sub>i3</sub>。最后代入 v<sub>x</sub> = v<sub>i1</sub>/2。`)]},
 {id:'stage-8',title:'第 8 题 分压偏置共射放大（简答 3）',kind:'简答题',image:'stage-bjt',source:stageSource,
  description:'已知 V<sub>CC</sub> = 12 V，R<sub>b1</sub> = 7.5 kΩ，R<sub>b2</sub> = 2.5 kΩ，R<sub>c</sub> = 2 kΩ，R<sub>e</sub> = 1 kΩ，R<sub>L</sub> = 2 kΩ，V<sub>T</sub> = 26 mV，V<sub>BEQ</sub> = 0.7 V，β = 50，r<sub>bb′</sub> = 200 Ω。画直流通路，求 Q 点；画小信号模型并计算 A<sub>v</sub>、R<sub>i</sub>、R<sub>o</sub>。',
  key:'直流时电容开路，基极分压用戴维南等效；中频时旁路电容将发射极接到交流地。',
  result:'I<sub>BQ</sub> ≈ 43.5 μA；I<sub>CQ</sub> ≈ 2.17 mA；V<sub>CEQ</sub> ≈ 5.43 V；A<sub>v</sub> ≈ −62.7；R<sub>i</sub> ≈ 560 Ω；R<sub>o</sub> ≈ 2 kΩ。',
  steps:[step('画直流通路并化简分压网络',`C₁、C₂、Cₑ 开路。V<sub>th</sub> = 12 × 2.5/(7.5 + 2.5) = 3 V，R<sub>th</sub> = 7.5 kΩ ∥ 2.5 kΩ = 1.875 kΩ。${pic('stage-bjt-dc.svg','分压偏置共射放大器直流通路','直流通路')}`),
  step('计算静态工作点',`${equation(`I<sub>BQ</sub> = ${fr('3 V − 0.7 V','1.875 kΩ + (1 + β) × 1 kΩ')} ≈ 43.5 μA`)}I<sub>CQ</sub> = βI<sub>BQ</sub> ≈ 2.17 mA，I<sub>EQ</sub> ≈ 2.22 mA。${equation('V<sub>CEQ</sub> = 12 V − I<sub>CQ</sub>R<sub>c</sub> − I<sub>EQ</sub>R<sub>e</sub> ≈ 5.43 V')}集电极高于基极，放大区假设成立。`),
  step('画中频小信号模型',`C₁、C₂、Cₑ 视为短路，电源端为交流地，发射极也为交流地。${pic('stage-bjt-ac.svg','共射电路中频小信号模型','中频小信号等效电路')}${equation(`r<sub>be</sub> = r<sub>bb′</sub> + (1 + β)${fr('V<sub>T</sub>','I<sub>EQ</sub>')} ≈ 798 Ω`)}`),
  step('求增益及输入、输出电阻',`${equation(`A<sub>v</sub> = ${fr('v<sub>o</sub>','v<sub>i</sub>')} = −${fr('β(R<sub>c</sub> ∥ R<sub>L</sub>)','r<sub>be</sub>')} ≈ −62.7`)}v<sub>i</sub> 取放大器输入端。R<sub>i</sub> = R<sub>b1</sub> ∥ R<sub>b2</sub> ∥ r<sub>be</sub> ≈ 560 Ω。求 R<sub>o</sub> 时移去 R<sub>L</sub>、将独立输入源置零，忽略晶体管输出电阻得 R<sub>o</sub> ≈ R<sub>c</sub> = 2 kΩ。`)]}
]});
