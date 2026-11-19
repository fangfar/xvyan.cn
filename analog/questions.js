const sub=(base, index)=>`${base}<sub>${index}</sub>`;
const fr=(n,d)=>`<span class="frac" role="math" aria-label="${n.replace(/<[^>]*>/g,'')} 除以 ${d.replace(/<[^>]*>/g,'')}"><span class="n" aria-hidden="true">${n}</span><span class="d" aria-hidden="true">${d}</span></span>`;
const equation=t=>`<div class="equation">${t}</div>`;
const step=(title,body)=>({title,body});
const pic = (file,alt,caption)=>`<figure class="worked-figure"><img src="images/${file}?v=20261118-diagrams" alt="${alt}"><figcaption>${caption}</figcaption></figure>`;
const groups=[
 {title:'第一次作业',topic:'集成运算放大器',items:[
  {id:'2.6',title:'2.6 求输出电压',kind:'计算题',image:'26.webp',description:'求图示电路的输出电压 v<sub>o</sub>。',key:'理想运放线性工作：先找同相端电位，再用虚短求输出。',steps:[
 step('判断工作状态','输出经 10 kΩ 电阻回到反相端，形成负反馈。假定运放在线性区，理想运放满足输入端电流为零、两输入端电压相等。'),
 step('求同相输入端电压',`2 kΩ 中电流为零，因此其两端无压降；3 V 电源经 6 kΩ 和 3 kΩ 分压。${equation(`v<sub>+</sub> = 3 × ${fr('3 kΩ','6 kΩ + 3 kΩ')} = 1 V`)}`),
 step('求输出电压',`由虚短 v<sub>−</sub> = v<sub>+</sub> = 1 V。反相端两只 10 kΩ 电阻串接在输出与地之间，且输入端不取电流。${equation(`v<sub>−</sub> = ${fr('10','10 + 10')}v<sub>o</sub> = ${fr('v<sub>o</sub>','2')}`)}因此 v<sub>o</sub> = 2 V。`)],result:'v<sub>o</sub> = 2 V'},
  {id:'2.7',title:'2.7 估算电阻范围',kind:'计算题',image:'27.webp',description:'在图示电路中，为保证电压增益不低于 40 dB，求电阻 R<sub>4</sub> 的范围。',key:'先把分贝换成倍数：40 dB 对应电压增益的绝对值 100。',steps:[
 step('分贝数换算为电压倍数',`${equation('20 lg |A<sub>v</sub>| ≥ 40 dB　⇒　|A<sub>v</sub>| ≥ 100')}`),
 step('对反相端列电流方程',`同相端通过 R<sub>P</sub> 接地，故 v<sub>+</sub> = v<sub>−</sub> = 0。设 R₂、R₃、R₄ 的公共节点为 v<sub>x</sub>。运放输入电流为零：${equation(`${fr('0 − v<sub>i</sub>','R₁')} + ${fr('0 − v<sub>x</sub>','R₂')} = 0`)}R₁ = R₂ = 10 kΩ，所以 v<sub>x</sub> = −v<sub>i</sub>。`),
 step('对反馈网络节点列方程',`${equation(`${fr('v<sub>x</sub> − 0','R₂')} + ${fr('v<sub>x</sub> − v<sub>o</sub>','R₃')} + ${fr('v<sub>x</sub>','R₄')} = 0`)}将 R₂ = R₃ = 10 kΩ 代入，得${equation(`v<sub>o</sub> = (2 + ${fr('10 kΩ','R₄')})v<sub>x</sub>，　A<sub>v</sub> = −(2 + ${fr('10 kΩ','R₄')})`)}`),
 step('求电阻范围',`对正电阻，令 2 + 10 kΩ/R₄ ≥ 100，可得${equation(`0 &lt; R₄ ≤ ${fr('10 000','98')} Ω ≈ 102 Ω`)}`)],result:'0 &lt; R<sub>4</sub> ≤ 约 102 Ω'},
  {id:'2.8',title:'2.8 求输出表达式',kind:'计算题',image:'28.webp',description:'求图题 2.8 的输出电压 v<sub>o</sub> 与输入电压 v<sub>i</sub> 的关系。输入在左，输出在右。',key:'把两个运放分开分析：下级反相，再看左侧分压。',steps:[
 step('先分析下方运放',`其同相端经电阻接地，故反相端为虚地。设下方运放输出为 v<sub>x</sub>，向反相节点列电流：${equation(`${fr('0 − v<sub>o</sub>','5R')} + ${fr('0 − v<sub>x</sub>','R')} = 0`)}得到 v<sub>x</sub> = −v<sub>o</sub>/5。`),
 step('分析上方同相端',`上方运放同相端不取电流，其左侧竖直电阻 R 内电流为零，因此该端电压等于 5R 与下方接地电阻 R 的分压点电压。${equation(`v<sub>+</sub> = ${fr('R','5R + R')}v<sub>x</sub> = ${fr('v<sub>x</sub>','6')}`)}`),
 step('利用上方运放虚短',`上方反相输入电流为零，输入侧电阻 R 上没有压降，所以 v<sub>−</sub> = v<sub>i</sub>。由虚短：${equation(`v<sub>i</sub> = v<sub>+</sub> = −${fr('v<sub>o</sub>','30')}`)}故 v<sub>o</sub> = −30v<sub>i</sub>。该结果以两个理想运放都处于线性工作状态为前提。`)],result:'v<sub>o</sub> = −30 v<sub>i</sub>'},
  {id:'2.10',title:'2.10 多输入运算电路',kind:'计算题',image:'210.webp',description:'求图示电路的输出电压 v<sub>o</sub>。',key:'先求同相端电位，再对反相端列节点电流方程。',steps:[
 step('计算同相端节点电位',`令 v<sub>+</sub> = v<sub>P</sub>，同相端输入电流为零。对该点列电流方程：${equation(`${fr('v<sub>P</sub> − v<sub>i3</sub>','6 kΩ')} + ${fr('v<sub>P</sub> − v<sub>i4</sub>','3 kΩ')} + ${fr('v<sub>P</sub>','6 kΩ')} = 0`)}整理得到 ${equation(`v<sub>P</sub> = ${fr('v<sub>i3</sub> + 2v<sub>i4</sub>','4')}`)}`),
 step('对反相端列电流方程',`设 v<sub>−</sub> = v<sub>N</sub>，由虚短 v<sub>N</sub> = v<sub>P</sub>。${equation(`${fr('v<sub>N</sub> − v<sub>i1</sub>','18 kΩ')} + ${fr('v<sub>N</sub> − v<sub>i2</sub>','9 kΩ')} + ${fr('v<sub>N</sub> − v<sub>o</sub>','12 kΩ')} = 0`)}`),
 step('整理结果',`两边乘以 12 kΩ：${equation(`v<sub>o</sub> = 3v<sub>N</sub> − ${fr('2','3')}v<sub>i1</sub> − ${fr('4','3')}v<sub>i2</sub>`)}代入 v<sub>N</sub> = (v<sub>i3</sub> + 2v<sub>i4</sub>)/4，即可得到四路输入的加权和。`)],result:`v<sub>o</sub> = −${fr('2','3')}v<sub>i1</sub> − ${fr('4','3')}v<sub>i2</sub> + ${fr('3','4')}v<sub>i3</sub> + ${fr('3','2')}v<sub>i4</sub>`}
 ]},
 {title:'第二次作业',topic:'半导体二极管',items:[
  {id:'3.6',title:'3.6 二极管逻辑电路',kind:'分析题',image:'36.webp',description:'二极管导通压降为 0.7 V。分别在 A、B 输入为（0，0）、（5，0）、（0，5）、（5，5）V 时，判断各管状态，求 Y 点电位和各元件电流，并说明电路功能。',key:'高电位输入使对应二极管导通，Y 的电位比高输入低 0.7 V。',steps:[
 step('判断方法',`把二极管阳极接输入 A 或 B，阴极接输出 Y。高输入经正向导通的二极管给电阻供电；导通时压降为 0.7 V。${equation(`I<sub>R</sub> = ${fr('V<sub>Y</sub>','1 kΩ')}，　I<sub>D1</sub> + I<sub>D2</sub> = I<sub>R</sub>`)}`),
 step('逐种情况计算',`<div class="table-wrap"><table><thead><tr><th>A / V</th><th>B / V</th><th>D₁</th><th>D₂</th><th>Y / V</th><th>I<sub>R</sub> / mA</th><th>二极管电流</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>截止</td><td>截止</td><td>0</td><td>0</td><td>均为 0</td></tr><tr><td>5</td><td>0</td><td>导通</td><td>截止</td><td>4.3</td><td>4.3</td><td>I₁ = 4.3 mA，I₂ = 0</td></tr><tr><td>0</td><td>5</td><td>截止</td><td>导通</td><td>4.3</td><td>4.3</td><td>I₁ = 0，I₂ = 4.3 mA</td></tr><tr><td>5</td><td>5</td><td>导通</td><td>导通</td><td>4.3</td><td>4.3</td><td>I₁ + I₂ = 4.3 mA</td></tr></tbody></table></div>两个输入同为 5 V 时，仅凭恒压降模型不能唯一确定两支路的分流；若额外假定两管完全相同且均流，各为 2.15 mA。`),
 step('说明逻辑功能','把 0 V 视为低电平、约 4.3 V 视为高电平；只要 A、B 任一为高，Y 就为高，因此是正逻辑或门。')],result:'正逻辑或门：任一输入为高，输出为高。'},
  {id:'3.7',title:'3.7 理想二极管判断',kind:'分析题',image:'37.webp',description:'判断各图中的理想二极管导通或截止，求 A、O 两点间电压 V<sub>AO</sub>。',key:'先假设截止，比较阳极和阴极电位；假设导通后再检查电流方向。',source:'参考学习通答案 · 推导补充',steps:[
 step('（a）假设截止再检查',`以 O 为零电位。若 D 截止，电阻无电流，A = −12 V，阳极为 −6 V；阳极高于阴极，假设矛盾，因此 D 导通。理想导通时 A = −6 V；电流 (−6 − (−12))/3 kΩ = 2 mA。`),
 step('（b）检查反偏',`截止时 A = −12 V，阳极为 −15 V，阳极低于阴极，D 反偏截止；电阻无电流，V<sub>AO</sub> = −12 V。`),
 step('（c）比较两个阳极',`D₁ 阳极接 0 V，D₂ 阳极接 −15 V。若 D₁ 导通，则 A = 0 V，D₂ 阳极低于阴极而截止；电阻电流为 (0 − (−12))/3 kΩ = 4 mA，方向符合 D₁ 导通假设。`),
 step('（d）检查两管方向',`D₂ 的阴极接 −6 V。若 D₂ 导通，则 A = −6 V，电流从 +12 V 经 3 kΩ 流向 D₂，大小为 (12 − (−6))/3 kΩ = 6 mA。此时 D₁ 的阳极为 −6 V、阴极为 0 V，D₁ 截止。`)],result:'（a）−6 V　（b）−12 V　（c）0 V　（d）−6 V'},
  {id:'3.9',title:'3.9 稳压管限幅波形',kind:'波形题',image:'39.webp',answerImage:'wave.svg',description:'稳压管正向压降 0.7 V，稳定电压 5 V，输入 v<sub>i</sub> = 8 sin ωt V。画出 v<sub>o1</sub>、v<sub>o2</sub> 波形并标出幅值。',key:'区分正向导通 0.7 V 与反向稳压 5 V。',source:'参考学习通答案 · 推导补充',steps:[
 step('确定单管导通条件',`（a）输出为正时，稳压管反向偏置；当输出将要超过 5 V 时反向击穿，使 v<sub>o1</sub> 钳位于 +5 V。输出为负时，电压低于 −0.7 V 后正向导通，钳位于 −0.7 V。`),
 step('写出单管分段关系',`${equation('v<sub>o1</sub> = −0.7 V　（v<sub>i</sub> &lt; −0.7 V）')}${equation('v<sub>o1</sub> = v<sub>i</sub>　（−0.7 V ≤ v<sub>i</sub> ≤ 5 V）')}${equation('v<sub>o1</sub> = 5 V　（v<sub>i</sub> &gt; 5 V）')}`),
 step('确定双管限幅',`（b）两只稳压管反向串联：任一极性超过门限时，一只正向导通（0.7 V），另一只反向稳压（5 V），所以两侧限幅均为 5.7 V。${equation('v<sub>o2</sub> = max(−5.7 V, min(v<sub>i</sub>, 5.7 V))')}将 v<sub>i</sub> = 8 sin ωt 代入，得到下方波形。`)],result:'v<sub>o1</sub>：−0.7 V 至 +5 V；　v<sub>o2</sub>：−5.7 V 至 +5.7 V'}
 ]},
 {title:'第三次作业',topic:'三极管放大电路',items:[
  {id:'3-1',title:'第 1 题 三极管放大区',kind:'填空题',description:'NPN 型三极管工作在放大区时，发射结（　　　），集电结（　　　）。（填正偏或反偏）',key:'放大区的两个 PN 结偏置方向要成对记忆。',source:'学习通正确答案',steps:[step('回顾放大区','发射结正向偏置，集电结反向偏置，才能形成正常的载流子注入和收集。')],result:'发射结正偏；集电结反偏。'},
  {id:'3-2',title:'第 2 题 静态工作点',kind:'填空题',description:'共射放大电路中，静态工作点 Q 设置过低容易产生（　　　）失真；设置过高容易产生（　　　）失真。',key:'这里的“高、低”以静态集电极电流大小为准。',source:'学习通正确答案',steps:[step('靠近截止与饱和','Q 过低时，电流向下变化容易碰到截止；Q 过高时，电流向上变化容易碰到饱和。')],result:'Q 过低：截止失真；Q 过高：饱和失真。'},
  {id:'3-3',title:'第 3 题 射极跟随器',kind:'填空题',description:'射极跟随器的电压增益约为 1，输入电阻较（　　　），输出电阻较（　　　），可以充当缓冲器。',key:'缓冲级希望前级负担小、驱动后级能力强。',source:'学习通正确答案',steps:[step('联系缓冲作用','输入电阻大，向前级索取的电流小；输出电阻小，带负载时输出电压不易变化。')],result:'输入电阻大；输出电阻小。'},
  {id:'3-4',title:'第 4 题 共射放大电路',kind:'计算题',image:'bjt.webp',description:'已知 β = 50，求静态工作点 Q、A<sub>v</sub> = v<sub>o</sub>/v<sub>i</sub>、A<sub>vs</sub> = v<sub>o</sub>/v<sub>s</sub>、输入电阻和输出电阻。要求画直流通路和小信号等效电路。',key:'先直流、后交流：电容在直流中开路，在中频小信号分析中短路。',source:'参考学习通答案 · 推导补充',steps:[
 step('画出直流通路',`直流分析时两个耦合电容开路，信号源与负载被隔开；保留电源 V<sub>CC</sub>、基极偏置电阻 R<sub>b</sub> 和集电极电阻 R<sub>C</sub>。${pic('bjt-dc.svg','共射放大电路直流通路','图 1：直流通路')}`),
 step('计算静态工作点',`按老师参考答案的近似，忽略 V<sub>BE</sub>，先求基极电流：${equation(`I<sub>BQ</sub> ≈ ${fr('12 V','300 kΩ')} = 40 μA`)}${equation('I<sub>CQ</sub> = βI<sub>BQ</sub> = 50 × 40 μA = 2 mA')}${equation('U<sub>CEQ</sub> = 12 V − I<sub>CQ</sub>R<sub>C</sub> = 12 − 2 mA × 4 kΩ = 4 V')}因此 Q ≈ (I<sub>CQ</sub> = 2 mA，U<sub>CEQ</sub> = 4 V)。若取硅管 V<sub>BE</sub> ≈ 0.7 V，数值会略有不同。`),
 step('建立中频小信号等效电路',`耦合电容视为短路，直流电源为交流地；用 r<sub>be</sub> 和受控电流源 βi<sub>b</sub> 表示三极管。${pic('bjt-ac.svg','共射放大电路中频小信号等效电路','图 2：中频小信号等效电路')}集电极负载为 R<sub>C</sub> ∥ R<sub>L</sub>。按题解近似 I<sub>E</sub> ≈ I<sub>C</sub> = 2 mA、r<sub>bb′</sub> = 200 Ω：${equation(`r<sub>be</sub> ≈ r<sub>bb′</sub> + (1 + β) ${fr('26 mV','I<sub>E</sub>')} = 200 + 51 × ${fr('26 mV','2 mA')} = 863 Ω`)}`),
 step('计算电压增益',`R<sub>C</sub> ∥ R<sub>L</sub> = 4 kΩ ∥ 4 kΩ = 2 kΩ，因此${equation(`A<sub>v</sub> = −${fr('β(R<sub>C</sub> ∥ R<sub>L</sub>)','r<sub>be</sub>')} = −${fr('50 × 2000','863')} ≈ −115.87`)}`),
 step('求输入、输出电阻与源电压增益',`${equation(`R<sub>i</sub> = R<sub>b</sub> ∥ r<sub>be</sub> ≈ r<sub>be</sub> = 863 Ω`)}忽略三极管输出电阻时，移除负载，从输出端向电路看 R<sub>o</sub> ≈ R<sub>C</sub> = 4 kΩ。${equation(`A<sub>vs</sub> = A<sub>v</sub>${fr('R<sub>i</sub>','R<sub>s</sub> + R<sub>i</sub>')} ≈ −115.87 × ${fr('863','500 + 863')} ≈ −73.36`)}`)], result:'I<sub>CQ</sub> ≈ 2 mA，U<sub>CEQ</sub> ≈ 4 V；A<sub>v</sub> ≈ −115.87，A<sub>vs</sub> ≈ −73.36；R<sub>i</sub> ≈ 863 Ω，R<sub>o</sub> ≈ 4 kΩ'}
 ]},
 {title:'第四次作业',topic:'场效应管',items:[
  {id:'4-1',title:'第 1 题 NMOS 工作区',kind:'单项选择',image:'curve1.webp',description:'增强型 NMOS 管，V<sub>TN</sub> = 1 V、V<sub>GS</sub> = 3 V、V<sub>DS</sub> = 1 V。Q 点位于哪个工作区？',options:['截止区','饱和区','可变电阻区','击穿区'],key:'先判断是否开启，再比较 VDS 与 VGS − VTN。',source:'学习通正确答案',steps:[step('先判断开启',equation('V<sub>GS</sub> = 3 V &gt; V<sub>TN</sub> = 1 V')),step('再比较工作区边界',`${equation('V<sub>DS</sub> = 1 V &lt; V<sub>GS</sub> − V<sub>TN</sub> = 2 V')}所以工作于可变电阻区。`)],result:'C．可变电阻区'},
  {id:'4-2',title:'第 2 题 夹断电压',kind:'单项选择',image:'curve2.webp',description:'根据图示 N 沟道耗尽型 MOSFET 的转移特性，判断夹断电压。',options:['−6 V','−4 V','−2 V','2 V'],key:'读转移曲线与横轴的交点。',source:'学习通正确答案',steps:[step('查找电流为零的位置','从曲线上看，漏极电流降至零时，栅源电压约为 −6 V。')],result:'A．−6 V'},
  {id:'4-3',title:'第 3 题 管型识别',kind:'单项选择',image:'symbol.webp',description:'判断图示场效应管的类型。',options:['P 沟道增强型 MOSFET','P 沟道耗尽型 MOSFET','N 沟道增强型 MOSFET','N 沟道耗尽型 MOSFET'],key:'结合课堂符号约定，先看沟道线是否断开，再看箭头方向。',source:'学习通正确答案',steps:[step('识别符号','按照本课程题目的符号约定，图中器件为 P 沟道增强型 MOSFET。')],result:'A．P 沟道增强型 MOSFET'},
  {id:'4-4',title:'第 4 题 JFET 饱和条件',kind:'单项选择',description:'耗尽型 N 沟道 JFET 工作在饱和区时，|V<sub>GD</sub>|（　　　）|V<sub>P</sub>|，此时漏极电流近似受控于 V<sub>GS</sub>。',options:['≥','＜','＝','≤'],key:'工作区条件必须结合正常偏置一起判断。',source:'学习通正确答案',steps:[step('比较夹断条件','在该题所采用的正常工作偏置下，漏端栅沟电压幅值达到夹断电压幅值，进入饱和区。')],result:'A．≥'},
  {id:'4-5',title:'第 5 题 MOS 放大电路',kind:'计算题',image:'mos.webp',description:'V<sub>DD</sub> = 15 V，R<sub>G</sub> = 100 kΩ，R<sub>1</sub> = 20 kΩ，R<sub>2</sub> = 80 kΩ，R<sub>D</sub> = 4 kΩ，R<sub>S</sub> = 1 kΩ；V<sub>TN</sub> = 1 V，K<sub>n</sub> = 1 mA/V²。忽略沟道长度调制，饱和区 I<sub>D</sub> = K<sub>n</sub>(V<sub>GS</sub> − V<sub>TN</sub>)²。求静态工作点并分析中频小信号参数。',key:'解出两个数学根后，必须检查开启和饱和条件。',source:'参考学习通答案 · 推导补充',steps:[
 step('画直流分析思路并求栅极电位',`直流下各电容开路，MOS 管栅极电流近似为零，R<sub>G</sub> 内无直流电压降。R₂ = 80 kΩ 和 R₁ = 20 kΩ 将 15 V 分压：${equation(`V<sub>G</sub> = 15 × ${fr('20','80 + 20')} = 3 V`)}设 I<sub>D</sub> 的数值单位为 mA，则 V<sub>S</sub> = I<sub>D</sub> × 1 kΩ，V<sub>GS</sub> = 3 − I<sub>D</sub>（V）。`),
 step('建立方程并检验根',`先假设管子开启并工作在饱和区：${equation('I<sub>D</sub> = K<sub>n</sub>(V<sub>GS</sub> − V<sub>TN</sub>)² = (2 − I<sub>D</sub>)²')}${equation('I<sub>D</sub>² − 5I<sub>D</sub> + 4 = 0　⇒　I<sub>D</sub> = 1 或 4 mA')}4 mA 会给出 V<sub>GS</sub> = −1 V，低于阈值 1 V，不符合开启假设，应舍去。`),
 step('静态点及饱和条件',`${equation('I<sub>DQ</sub> = 1 mA，　V<sub>SQ</sub> = 1 V，　V<sub>GSQ</sub> = 2 V')}${equation('V<sub>DQ</sub> = 15 − 1 mA × 4 kΩ = 11 V，　V<sub>DSQ</sub> = 11 − 1 = 10 V')}因为 V<sub>DSQ</sub> = 10 V ≥ V<sub>GSQ</sub> − V<sub>TN</sub> = 1 V，饱和区假设成立。`),
 step('中频小信号参数',`中频时 C₁、C₂、C<sub>S</sub> 近似短路，源极交流接地；电源为交流地。${pic('mos-ac.svg','共源放大器的中频等效电路','中频等效：源极交流接地，栅极不取电流')}忽略沟道长度调制：${equation('g<sub>m</sub> = 2K<sub>n</sub>(V<sub>GSQ</sub> − V<sub>TN</sub>) = 2 mS')}${equation('A<sub>v</sub> = −g<sub>m</sub>R<sub>D</sub> = −2 mS × 4 kΩ = −8')}${equation('R<sub>i</sub> = R<sub>G</sub> + (R₁ ∥ R₂) = 100 + 16 = 116 kΩ，　R<sub>o</sub> ≈ R<sub>D</sub> = 4 kΩ')}这里的 v<sub>i</sub> 取图中的外部输入端，故输入电阻包括串联的 R<sub>G</sub>。`)],result:'I<sub>DQ</sub> = 1 mA，V<sub>GSQ</sub> = 2 V，V<sub>DSQ</sub> = 10 V；A<sub>v</sub> ≈ −8，R<sub>i</sub> ≈ 116 kΩ，R<sub>o</sub> ≈ 4 kΩ'}
 ]},
 {title:'第五次作业',topic:'差动放大电路',items:[
  {id:'5-1',title:'第 1 题 共模信号',kind:'填空题',description:'集成运放常采用差动放大电路作为输入级，该电路对（　　　）信号有很强的抑制作用，从而减小零点漂移。',key:'两端变化相同的信号称为共模信号。',source:'独立解答 · 作业待批阅',steps:[step('区分差模和共模','两输入端同向、等幅变化属于共模；理想对称差动电路对它的输出响应很小。')],result:'共模'},
  {id:'5-2',title:'第 2 题 恒流源的作用',kind:'填空题',description:'长尾式差动放大电路采用恒流源替代射极电阻，可以（　　　）单端输出时的共模抑制比。（填提高或降低）',key:'恒流源的交流等效电阻大，有助于减小共模增益。',source:'独立解答 · 作业待批阅',steps:[step('看对共模增益的影响','尾部恒流源的交流等效电阻很大，会抑制共模输入引起的尾电流变化；共模增益减小，因此共模抑制比提高。')],result:'提高'},
  {id:'6.6',title:'6.6 差动放大电路',kind:'计算题',image:'diff.webp',description:'图示对称差动电路中，T₁、T₂ 为硅管，β₁ = β₂ = 50。求静态工作点；双入单出、双入双出时各自的差模增益、共模增益和共模抑制比。',key:'先按对称关系求每管电流，再分别分析差模与共模。',source:'独立解答 · 作业待批阅',steps:[
   step('先说明近似',`取 V<sub>BE</sub> ≈ 0.7 V、I<sub>E</sub> ≈ I<sub>C</sub>，忽略基极电流在 1 kΩ 偏置电阻上的压降。微变参数计算假设 r<sub>bb′</sub> ≈ 300 Ω；该值未在题图中明确给出，应以课堂约定为准。`),
   step('求静态工作点',`${equation(`I<sub>E</sub> ≈ ${fr('12 − 0.7','2 × 15.3 kΩ')} = 0.369 mA`)}${equation('V<sub>C</sub> ≈ 12 − 0.369 mA × 10 kΩ = 8.31 V')}发射极约为 −0.7 V，因此 V<sub>CE</sub> ≈ 9.01 V。注意 V<sub>C</sub> 是对地电位，V<sub>CE</sub> 是集电极相对发射极的电压。`),
   step('求微变电阻',`${equation(`r<sub>be</sub> ≈ 300 Ω + 51 × ${fr('26 mV','0.369 mA')} ≈ 3.89 kΩ`)}`),
   step('双入单出',`定义 v<sub>id</sub> = v<sub>i1</sub> − v<sub>i2</sub>，v<sub>ic</sub> = (v<sub>i1</sub> + v<sub>i2</sub>)/2，输出取左集电极对地。${pic('diff-half.svg','差动放大器左侧半电路','左侧半电路：差模 ZE = 0，共模 ZE = 2RE')}${equation(`A<sub>vd1</sub> ≈ −${fr('βR<sub>C</sub>','2(R<sub>b</sub> + r<sub>be</sub>)')} ≈ −51.1`)}${equation(`A<sub>vc1</sub> ≈ −${fr('βR<sub>C</sub>','R<sub>b</sub> + r<sub>be</sub> + 2(1 + β)R<sub>E</sub>')} ≈ −0.319`)}单端 K<sub>CMR</sub> ≈ 160，约 44.1 dB。`),
   step('双入双出',`取输出 v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub>，差模增益约为单端两倍。理想完全对称时共模输出相互抵消。${equation('A<sub>vd</sub> ≈ −102.2　　A<sub>vc</sub> = 0　　K<sub>CMR</sub> → ∞')}输出极性反转时，差模增益符号也反转。`)],result:'每管 I<sub>C</sub> ≈ 0.369 mA，V<sub>CE</sub> ≈ 9.01 V；单端 A<sub>vd1</sub> ≈ −51.1，A<sub>vc1</sub> ≈ −0.319，K<sub>CMR</sub> ≈ 160；双端 A<sub>vd</sub> ≈ −102.2，A<sub>vc</sub> = 0，K<sub>CMR</sub> → ∞'}
 ]}
];
