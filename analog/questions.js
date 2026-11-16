const sub=(base, index)=>`${base}<sub>${index}</sub>`;
const fr=(n,d)=>`<span class="frac" role="math" aria-label="${n.replace(/<[^>]*>/g,'')} 除以 ${d.replace(/<[^>]*>/g,'')}"><span class="n" aria-hidden="true">${n}</span><span class="d" aria-hidden="true">${d}</span></span>`;
const equation=t=>`<div class="equation">${t}</div>`;
const step=(title,body)=>({title,body});
const groups=[
 {title:'第一次作业',topic:'集成运算放大器',items:[
  {id:'2.6',title:'2.6 求输出电压',kind:'计算题',image:'26',description:'求图示电路的输出电压 v<sub>o</sub>。',key:'理想运放线性工作：先找同相端电位，再用虚短求输出。',steps:[
   step('先看同相输入端',`理想运放输入电流为零，2 kΩ 上没有压降。同相端的电位由 6 kΩ 和 3 kΩ 分压得到。${equation(`v<sub>+</sub> = 3 × ${fr('3','6 + 3')} = 1 V`)}`),
   step('利用虚短',`电路有负反馈，在线性工作时 v<sub>−</sub> = v<sub>+</sub>。两个 10 kΩ 把输出电压分成两半。${equation(`v<sub>−</sub> = ${fr('v<sub>o</sub>','2')} = 1 V`)}`)],result:'v<sub>o</sub> = 2 V'},
  {id:'2.7',title:'2.7 估算电阻范围',kind:'计算题',image:'27',description:'在图示电路中，为保证电压增益不低于 40 dB，求电阻 R<sub>4</sub> 的范围。',key:'先把分贝换成倍数：40 dB 对应电压增益的绝对值 100。',steps:[
   step('将分贝换成倍数',equation(`20 lg |A<sub>v</sub>| ≥ 40，　|A<sub>v</sub>| ≥ 100`)),
   step('对两个节点列方程',`同相端接地，反相端为虚地。设 R<sub>2</sub>、R<sub>3</sub>、R<sub>4</sub> 的交点为 v<sub>x</sub>，输入节点列电流得到 v<sub>x</sub> = −v<sub>i</sub>。${equation(`${fr('v<sub>x</sub>','10 kΩ')} + ${fr('v<sub>x</sub>','R<sub>4</sub>')} + ${fr('v<sub>x</sub> − v<sub>o</sub>','10 kΩ')} = 0`)}`),
   step('求范围',`${equation(`A<sub>v</sub> = −(2 + ${fr('10 kΩ','R<sub>4</sub>')})`)}取 R<sub>4</sub> 为正，令增益绝对值不小于 100。`)],result:'0 &lt; R<sub>4</sub> ≤ 约 102 Ω'},
  {id:'2.8',title:'2.8 求输出表达式',kind:'计算题',image:'28',description:'求图示放大电路中输出电压 v<sub>o</sub> 的表达式。',key:'把两个运放分开分析：下级反相，再看左侧分压。',steps:[
   step('先看下方运放',`同相端为零，反相端为虚地；输入电阻为 5R、反馈电阻为 R。设下方输出为 v<sub>x</sub>。${equation(`v<sub>x</sub> = −${fr('R','5R')} v<sub>o</sub> = −${fr('v<sub>o</sub>','5')}`)}`),
   step('再看上方运放',`上方同相端不取电流，5R 和接地电阻 R 分压，故 v<sub>+</sub> = v<sub>x</sub>/6。反相输入电流为零，v<sub>−</sub> = v<sub>i</sub>。${equation(`v<sub>i</sub> = ${fr('v<sub>x</sub>','6')} = −${fr('v<sub>o</sub>','30')}`)}`)],result:'v<sub>o</sub> = −30 v<sub>i</sub>'},
  {id:'2.10',title:'2.10 多输入运算电路',kind:'计算题',image:'210',description:'求图示电路的输出电压 v<sub>o</sub>。',key:'先求同相端电位，再对反相端列节点电流方程。',steps:[
   step('求同相端电位',`输入端不取电流，对同相节点列电流，得到${equation(`v<sub>+</sub> = ${fr('v<sub>i3</sub>','4')} + ${fr('v<sub>i4</sub>','2')}`)}`),
   step('反相端列电流',`虚短使 v<sub>−</sub> = v<sub>+</sub>，再列节点电流：${equation(`${fr('v<sub>−</sub> − v<sub>i1</sub>','18k')} + ${fr('v<sub>−</sub> − v<sub>i2</sub>','9k')} + ${fr('v<sub>−</sub> − v<sub>o</sub>','12k')} = 0`)}将第一步代入并整理。`)],result:`v<sub>o</sub> = −${fr('2','3')}v<sub>i1</sub> − ${fr('4','3')}v<sub>i2</sub> + ${fr('3','4')}v<sub>i3</sub> + ${fr('3','2')}v<sub>i4</sub>`}
 ]},
 {title:'第二次作业',topic:'半导体二极管',items:[
  {id:'3.6',title:'3.6 二极管或门',kind:'分析题',image:'36',description:'二极管导通压降为 0.7 V。分别在 A、B 输入为（0，0）、（5，0）、（0，5）、（5，5）V 时，判断各管状态，求 Y 点电位和各元件电流，并说明电路功能。',key:'高电位输入使对应二极管导通，Y 的电位比高输入低 0.7 V。',steps:[
   step('两个输入都是 0 V','两管截止，Y 被电阻拉到 0 V，各电流均为零。'),
   step('只有一个输入为 5 V',`5 V 侧二极管导通，另一只截止。${equation('V<sub>Y</sub> = 5 − 0.7 = 4.3 V　　I<sub>R</sub> = 4.3 mA')}导通管电流为 4.3 mA，截止管为零。`),
   step('两个输入都是 5 V','两管均导通，Y = 4.3 V，总电流为 4.3 mA。若假设两管完全相同并均流，各支路约 2.15 mA；仅凭恒压降模型不能唯一确定两管的分流。')],result:'正逻辑或门：任一输入为高，输出为高。'},
  {id:'3.7',title:'3.7 理想二极管判断',kind:'分析题',image:'37',description:'判断各图中的理想二极管导通或截止，求 A、O 两点间电压 V<sub>AO</sub>。',key:'先假设截止，比较阳极和阴极电位；假设导通后再检查电流方向。',source:'参考学习通教师答案',steps:[
   step('（a）与（b）','（a）截止假设下，阳极 −6 V、阴极趋向 −12 V，因此 D 导通，A 钳位于 −6 V。（b）阳极 −15 V、阴极 −12 V，D 反偏截止，A 为 −12 V。'),
   step('（c）与（d）','（c）D₁ 将 A 钳位在 0 V，此时 D₂ 反偏。（d）D₂ 将 A 钳位在 −6 V，此时 D₁ 的阳极低于阴极而截止。')],result:'（a）−6 V　（b）−12 V　（c）0 V　（d）−6 V'},
  {id:'3.9',title:'3.9 稳压管限幅波形',kind:'波形题',image:'39',answerImage:'wave',description:'稳压管正向压降 0.7 V，稳定电压 5 V，输入 v<sub>i</sub> = 8 sin ωt V。画出 v<sub>o1</sub>、v<sub>o2</sub> 波形并标出幅值。',key:'区分正向导通 0.7 V 与反向稳压 5 V。',source:'参考学习通教师答案',steps:[
   step('单只稳压管','正半周超过 5 V 后反向稳压，输出钳在 +5 V；负半周低于 −0.7 V 后正向导通，钳在 −0.7 V。'),
   step('两只反向串联','任一极性下，一只反向稳压、另一只正向导通，限幅值为 5 + 0.7 = 5.7 V。')],result:'v<sub>o1</sub>：−0.7 V 至 +5 V；　v<sub>o2</sub>：−5.7 V 至 +5.7 V'}
 ]},
 {title:'第三次作业',topic:'三极管放大电路',items:[
  {id:'3-1',title:'第 1 题 三极管放大区',kind:'填空题',description:'NPN 型三极管工作在放大区时，发射结（　　　），集电结（　　　）。（填正偏或反偏）',key:'放大区的两个 PN 结偏置方向要成对记忆。',source:'学习通正确答案',steps:[step('回顾放大区','发射结正向偏置，集电结反向偏置，才能形成正常的载流子注入和收集。')],result:'发射结正偏；集电结反偏。'},
  {id:'3-2',title:'第 2 题 静态工作点',kind:'填空题',description:'共射放大电路中，静态工作点 Q 设置过低容易产生（　　　）失真；设置过高容易产生（　　　）失真。',key:'这里的“高、低”以静态集电极电流大小为准。',source:'学习通正确答案',steps:[step('靠近截止与饱和','Q 过低时，电流向下变化容易碰到截止；Q 过高时，电流向上变化容易碰到饱和。')],result:'Q 过低：截止失真；Q 过高：饱和失真。'},
  {id:'3-3',title:'第 3 题 射极跟随器',kind:'填空题',description:'射极跟随器的电压增益约为 1，输入电阻较（　　　），输出电阻较（　　　），可以充当缓冲器。',key:'缓冲级希望前级负担小、驱动后级能力强。',source:'学习通正确答案',steps:[step('联系缓冲作用','输入电阻大，向前级索取的电流小；输出电阻小，带负载时输出电压不易变化。')],result:'输入电阻大；输出电阻小。'},
  {id:'3-4',title:'第 4 题 共射放大电路',kind:'计算题',image:'bjt',description:'已知 β = 50，求静态工作点 Q、A<sub>v</sub> = v<sub>o</sub>/v<sub>i</sub>、A<sub>vs</sub> = v<sub>o</sub>/v<sub>s</sub>、输入电阻和输出电阻。要求画直流通路和小信号等效电路。',key:'先直流、后交流：电容在直流中开路，在中频小信号分析中短路。',source:'参考学习通教师答案',steps:[
   step('直流通路与 Q 点',`电容开路，输入源和负载断开。老师参考解忽略 V<sub>BE</sub>。${equation(`I<sub>B</sub> ≈ ${fr('12 V','300 kΩ')} = 40 μA`)}${equation('I<sub>C</sub> ≈ βI<sub>B</sub> = 2 mA　　U<sub>CE</sub> ≈ 12 − 2 mA × 4 kΩ = 4 V')}`),
   step('画中频小信号通路','电容短路、电源交流接地；R<sub>b</sub> 接地，输入侧是 r<sub>be</sub>，集电极用 βi<sub>b</sub> 的受控电流源表示，R<sub>C</sub> 与 R<sub>L</sub> 并联。'),
   step('计算增益与电阻',`${equation(`r<sub>be</sub> ≈ 200 Ω + (1 + β) ${fr('26 mV','I<sub>E</sub>')} ≈ 863 Ω`)}${equation(`A<sub>v</sub> ≈ −${fr('β(R<sub>C</sub> ∥ R<sub>L</sub>)','r<sub>be</sub>')} = −115.87`)}R<sub>i</sub> ≈ 863 Ω，R<sub>o</sub> ≈ 4 kΩ；计入信号源电阻后，A<sub>vs</sub> ≈ −73.36。若计入 V<sub>BE</sub> ≈ 0.7 V，结果会略有不同。`)],result:'Q ≈（2 mA，4 V）；A<sub>v</sub> ≈ −115.87；A<sub>vs</sub> ≈ −73.36'}
 ]},
 {title:'第四次作业',topic:'场效应管',items:[
  {id:'4-1',title:'第 1 题 NMOS 工作区',kind:'单项选择',image:'curve1',description:'增强型 NMOS 管，V<sub>TN</sub> = 1 V、V<sub>GS</sub> = 3 V、V<sub>DS</sub> = 1 V。Q 点位于哪个工作区？',options:['截止区','饱和区','可变电阻区','击穿区'],key:'先判断是否开启，再比较 VDS 与 VGS − VTN。',source:'学习通正确答案',steps:[step('先判断开启',equation('V<sub>GS</sub> = 3 V &gt; V<sub>TN</sub> = 1 V')),step('再比较工作区边界',`${equation('V<sub>DS</sub> = 1 V &lt; V<sub>GS</sub> − V<sub>TN</sub> = 2 V')}所以工作于可变电阻区。`)],result:'C．可变电阻区'},
  {id:'4-2',title:'第 2 题 夹断电压',kind:'单项选择',image:'curve2',description:'根据图示 N 沟道耗尽型 MOSFET 的转移特性，判断夹断电压。',options:['−6 V','−4 V','−2 V','2 V'],key:'读转移曲线与横轴的交点。曲线为根据原图重绘的示意。',source:'学习通正确答案',steps:[step('查找电流为零的位置','从曲线上看，漏极电流降至零时，栅源电压约为 −6 V。')],result:'A．−6 V'},
  {id:'4-3',title:'第 3 题 管型识别',kind:'单项选择',image:'symbol',description:'判断图示场效应管的类型。',options:['P 沟道增强型 MOSFET','P 沟道耗尽型 MOSFET','N 沟道增强型 MOSFET','N 沟道耗尽型 MOSFET'],key:'结合课堂符号约定，先看沟道线是否断开，再看箭头方向。',source:'学习通正确答案',steps:[step('识别符号','按照本课程题目的符号约定，图中器件为 P 沟道增强型 MOSFET。')],result:'A．P 沟道增强型 MOSFET'},
  {id:'4-4',title:'第 4 题 JFET 饱和条件',kind:'单项选择',description:'耗尽型 N 沟道 JFET 工作在饱和区时，|V<sub>GD</sub>|（　　　）|V<sub>P</sub>|，此时漏极电流近似受控于 V<sub>GS</sub>。',options:['≥','＜','＝','≤'],key:'工作区条件必须结合正常偏置一起判断。',source:'学习通正确答案',steps:[step('比较夹断条件','在该题所采用的正常工作偏置下，漏端栅沟电压幅值达到夹断电压幅值，进入饱和区。')],result:'A．≥'},
  {id:'4-5',title:'第 5 题 MOS 放大电路',kind:'计算题',image:'mos',description:'V<sub>DD</sub> = 15 V，R<sub>G</sub> = 100 kΩ，R<sub>1</sub> = 20 kΩ，R<sub>2</sub> = 80 kΩ，R<sub>D</sub> = 4 kΩ，R<sub>S</sub> = 1 kΩ；V<sub>TN</sub> = 1 V，K<sub>n</sub> = 1 mA/V²。忽略沟道长度调制，饱和区 I<sub>D</sub> = K<sub>n</sub>(V<sub>GS</sub> − V<sub>TN</sub>)²。求静态工作点并分析中频小信号参数。',key:'解出两个数学根后，必须检查开启和饱和条件。',source:'参考学习通教师答案',steps:[
   step('计算栅极静态电压',`${equation(`V<sub>G</sub> = 15 × ${fr('20','20 + 80')} = 3 V`)}栅极电流近似为零。以 mA 为单位表示 I<sub>D</sub>，V<sub>S</sub> = I<sub>D</sub> × 1 kΩ。`),
   step('求电流并舍去无效根',`${equation('V<sub>GS</sub> = 3 − I<sub>D</sub>　；　I<sub>D</sub> = (2 − I<sub>D</sub>)²')}数学根为 1 mA 和 4 mA。4 mA 对应 V<sub>GS</sub> = −1 V，未开启，舍去。`),
   step('检查饱和并算增益',`${equation('I<sub>DQ</sub> = 1 mA，　V<sub>GSQ</sub> = 2 V，　V<sub>DSQ</sub> = 10 V')}10 V ≥ V<sub>GSQ</sub> − V<sub>TN</sub> = 1 V，满足饱和。中频下 C<sub>S</sub> 旁路 R<sub>S</sub>，g<sub>m</sub> = 2 mS。${equation('A<sub>v</sub> ≈ −g<sub>m</sub>R<sub>D</sub> = −8')}R<sub>i</sub> ≈ R<sub>G</sub> + (R₁ ∥ R₂) = 116 kΩ，R<sub>o</sub> ≈ R<sub>D</sub> = 4 kΩ。`)],result:'I<sub>DQ</sub> = 1 mA；V<sub>GSQ</sub> = 2 V；V<sub>DSQ</sub> = 10 V；A<sub>v</sub> ≈ −8'}
 ]},
 {title:'第五次作业',topic:'差动放大电路',items:[
  {id:'5-1',title:'第 1 题 共模信号',kind:'填空题',description:'集成运放常采用差动放大电路作为输入级，该电路对（　　　）信号有很强的抑制作用，从而减小零点漂移。',key:'两端变化相同的信号称为共模信号。',source:'独立解答 · 作业待批阅',steps:[step('区分差模和共模','两输入端同向、等幅变化属于共模；理想对称差动电路对它的输出响应很小。')],result:'共模'},
  {id:'5-2',title:'第 2 题 恒流源的作用',kind:'填空题',description:'长尾式差动放大电路采用恒流源替代射极电阻，可以（　　　）单端输出时的共模抑制比。（填提高或降低）',key:'恒流源的交流等效电阻大，有助于减小共模增益。',source:'独立解答 · 作业待批阅',steps:[step('看对共模增益的影响','尾部恒流源的交流等效电阻很大，会抑制共模输入引起的尾电流变化；共模增益减小，因此共模抑制比提高。')],result:'提高'},
  {id:'6.6',title:'6.6 差动放大电路',kind:'计算题',image:'diff',description:'图示对称差动电路中，T₁、T₂ 为硅管，β₁ = β₂ = 50。求静态工作点；双入单出的差模、共模电压增益；双入双出的差模、共模增益和共模抑制比。',key:'先按对称关系求每管电流，再分别分析差模与共模。',source:'独立解答 · 作业待批阅',steps:[
   step('先说明近似',`取 V<sub>BE</sub> ≈ 0.7 V、I<sub>E</sub> ≈ I<sub>C</sub>，忽略基极电流在 1 kΩ 偏置电阻上的压降。微变参数计算假设 r<sub>bb′</sub> ≈ 300 Ω；该值未在题图中明确给出，应以课堂约定为准。`),
   step('求静态工作点',`${equation(`I<sub>E</sub> ≈ ${fr('12 − 0.7','2 × 15.3 kΩ')} = 0.369 mA`)}${equation('V<sub>C</sub> ≈ 12 − 0.369 mA × 10 kΩ = 8.31 V')}发射极约为 −0.7 V，因此 V<sub>CE</sub> ≈ 9.01 V。注意 V<sub>C</sub> 是对地电位，V<sub>CE</sub> 是集电极相对发射极的电压。`),
   step('求微变电阻',`${equation(`r<sub>be</sub> ≈ 300 Ω + 51 × ${fr('26 mV','0.369 mA')} ≈ 3.89 kΩ`)}`),
   step('双入单出',`定义 v<sub>id</sub> = v<sub>i1</sub> − v<sub>i2</sub>，v<sub>ic</sub> = (v<sub>i1</sub> + v<sub>i2</sub>)/2，输出取左集电极对地。${equation(`A<sub>vd1</sub> ≈ −${fr('βR<sub>C</sub>','2(R<sub>b</sub> + r<sub>be</sub>)')} ≈ −51.1`)}${equation(`A<sub>vc1</sub> ≈ −${fr('βR<sub>C</sub>','R<sub>b</sub> + r<sub>be</sub> + 2(1 + β)R<sub>E</sub>')} ≈ −0.319`)}单端 K<sub>CMR</sub> ≈ 160，约 44.1 dB。`),
   step('双入双出',`取输出 v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub>，差模增益约为单端两倍。理想完全对称时共模输出相互抵消。${equation('A<sub>vd</sub> ≈ −102.2　　A<sub>vc</sub> = 0　　K<sub>CMR</sub> → ∞')}输出极性反转时，差模增益符号也反转。`)],result:'每管 I<sub>C</sub> ≈ 0.369 mA；V<sub>CE</sub> ≈ 9.01 V；双端 A<sub>vd</sub> ≈ −102.2'}
 ]}
];
