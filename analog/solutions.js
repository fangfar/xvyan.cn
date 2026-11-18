const detail = Object.fromEntries(groups.flatMap(g=>g.items).map(q=>[q.id,q]));
const eq = equation;
const pic = (file,alt,caption)=>`<figure class="worked-figure"><img src="images/${file}?v=20261118-diagrams" alt="${alt}"><figcaption>${caption}</figcaption></figure>`;
Object.assign(detail['2.6'],{steps:[
 step('判断工作状态','输出经 10 kΩ 电阻回到反相端，形成负反馈。假定运放在线性区，理想运放满足输入端电流为零、两输入端电压相等。'),
 step('求同相输入端电压',`2 kΩ 中电流为零，因此其两端无压降；3 V 电源经 6 kΩ 和 3 kΩ 分压。${eq(`v<sub>+</sub> = 3 × ${fr('3 kΩ','6 kΩ + 3 kΩ')} = 1 V`)}`),
 step('求输出电压',`由虚短 v<sub>−</sub> = v<sub>+</sub> = 1 V。反相端两只 10 kΩ 电阻串接在输出与地之间，且输入端不取电流。${eq(`v<sub>−</sub> = ${fr('10','10 + 10')}v<sub>o</sub> = ${fr('v<sub>o</sub>','2')}`)}因此 v<sub>o</sub> = 2 V。`)]});
Object.assign(detail['2.7'],{steps:[
 step('分贝数换算为电压倍数',`${eq('20 lg |A<sub>v</sub>| ≥ 40 dB　⇒　|A<sub>v</sub>| ≥ 100')}`),
 step('对反相端列电流方程',`同相端通过 R<sub>P</sub> 接地，故 v<sub>+</sub> = v<sub>−</sub> = 0。设 R₂、R₃、R₄ 的公共节点为 v<sub>x</sub>。运放输入电流为零：${eq(`${fr('0 − v<sub>i</sub>','R₁')} + ${fr('0 − v<sub>x</sub>','R₂')} = 0`)}R₁ = R₂ = 10 kΩ，所以 v<sub>x</sub> = −v<sub>i</sub>。`),
 step('对反馈网络节点列方程',`${eq(`${fr('v<sub>x</sub> − 0','R₂')} + ${fr('v<sub>x</sub> − v<sub>o</sub>','R₃')} + ${fr('v<sub>x</sub>','R₄')} = 0`)}将 R₂ = R₃ = 10 kΩ 代入，得${eq(`v<sub>o</sub> = (2 + ${fr('10 kΩ','R₄')})v<sub>x</sub>，　A<sub>v</sub> = −(2 + ${fr('10 kΩ','R₄')})`)}`),
 step('求电阻范围',`对正电阻，令 2 + 10 kΩ/R₄ ≥ 100，可得${eq(`0 &lt; R₄ ≤ ${fr('10 000','98')} Ω ≈ 102 Ω`)}`)]});
Object.assign(detail['2.8'],{steps:[
 step('先分析下方运放',`其同相端经电阻接地，故反相端为虚地。设下方运放输出为 v<sub>x</sub>，向反相节点列电流：${eq(`${fr('0 − v<sub>o</sub>','5R')} + ${fr('0 − v<sub>x</sub>','R')} = 0`)}得到 v<sub>x</sub> = −v<sub>o</sub>/5。`),
 step('分析上方同相端',`上方运放同相端不取电流，其左侧竖直电阻 R 内电流为零，因此该端电压等于 5R 与下方接地电阻 R 的分压点电压。${eq(`v<sub>+</sub> = ${fr('R','5R + R')}v<sub>x</sub> = ${fr('v<sub>x</sub>','6')}`)}`),
 step('利用上方运放虚短',`上方反相输入电流为零，输入侧电阻 R 上没有压降，所以 v<sub>−</sub> = v<sub>i</sub>。由虚短：${eq(`v<sub>i</sub> = v<sub>+</sub> = −${fr('v<sub>o</sub>','30')}`)}故 v<sub>o</sub> = −30v<sub>i</sub>。该结果以两个理想运放都处于线性工作状态为前提。`)]});
Object.assign(detail['2.10'],{steps:[
 step('计算同相端节点电位',`令 v<sub>+</sub> = v<sub>P</sub>，同相端输入电流为零。对该点列电流方程：${eq(`${fr('v<sub>P</sub> − v<sub>i3</sub>','6 kΩ')} + ${fr('v<sub>P</sub> − v<sub>i4</sub>','3 kΩ')} + ${fr('v<sub>P</sub>','6 kΩ')} = 0`)}整理得到 ${eq(`v<sub>P</sub> = ${fr('v<sub>i3</sub> + 2v<sub>i4</sub>','4')}`)}`),
 step('对反相端列电流方程',`设 v<sub>−</sub> = v<sub>N</sub>，由虚短 v<sub>N</sub> = v<sub>P</sub>。${eq(`${fr('v<sub>N</sub> − v<sub>i1</sub>','18 kΩ')} + ${fr('v<sub>N</sub> − v<sub>i2</sub>','9 kΩ')} + ${fr('v<sub>N</sub> − v<sub>o</sub>','12 kΩ')} = 0`)}`),
 step('整理结果',`两边乘以 12 kΩ：${eq(`v<sub>o</sub> = 3v<sub>N</sub> − ${fr('2','3')}v<sub>i1</sub> − ${fr('4','3')}v<sub>i2</sub>`)}代入 v<sub>N</sub> = (v<sub>i3</sub> + 2v<sub>i4</sub>)/4，即可得到四路输入的加权和。`)]});
Object.assign(detail['3.6'],{steps:[
 step('判断方法',`把二极管阳极接输入 A 或 B，阴极接输出 Y。高输入经正向导通的二极管给电阻供电；导通时压降为 0.7 V。${eq(`I<sub>R</sub> = ${fr('V<sub>Y</sub>','1 kΩ')}，　I<sub>D1</sub> + I<sub>D2</sub> = I<sub>R</sub>`)}`),
 step('逐种情况计算',`<div class="table-wrap"><table><thead><tr><th>A / V</th><th>B / V</th><th>D₁</th><th>D₂</th><th>Y / V</th><th>I<sub>R</sub> / mA</th><th>二极管电流</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>截止</td><td>截止</td><td>0</td><td>0</td><td>均为 0</td></tr><tr><td>5</td><td>0</td><td>导通</td><td>截止</td><td>4.3</td><td>4.3</td><td>I₁ = 4.3 mA，I₂ = 0</td></tr><tr><td>0</td><td>5</td><td>截止</td><td>导通</td><td>4.3</td><td>4.3</td><td>I₁ = 0，I₂ = 4.3 mA</td></tr><tr><td>5</td><td>5</td><td>导通</td><td>导通</td><td>4.3</td><td>4.3</td><td>I₁ + I₂ = 4.3 mA</td></tr></tbody></table></div>两个输入同为 5 V 时，仅凭恒压降模型不能唯一确定两支路的分流；若额外假定两管完全相同且均流，各为 2.15 mA。`),
 step('说明逻辑功能','把 0 V 视为低电平、约 4.3 V 视为高电平；只要 A、B 任一为高，Y 就为高，因此是正逻辑或门。')]});
Object.assign(detail['3.7'],{steps:[
 step('（a）假设截止再检查',`以 O 为零电位。若 D 截止，电阻无电流，A = −12 V，阳极为 −6 V；阳极高于阴极，假设矛盾，因此 D 导通。理想导通时 A = −6 V；电流 (−6 − (−12))/3 kΩ = 2 mA。`),
 step('（b）检查反偏',`截止时 A = −12 V，阳极为 −15 V，阳极低于阴极，D 反偏截止；电阻无电流，V<sub>AO</sub> = −12 V。`),
 step('（c）比较两个阳极',`D₁ 阳极接 0 V，D₂ 阳极接 −15 V。若 D₁ 导通，则 A = 0 V，D₂ 阳极低于阴极而截止；电阻电流为 (0 − (−12))/3 kΩ = 4 mA，方向符合 D₁ 导通假设。`),
 step('（d）检查两管方向',`D₂ 的阴极接 −6 V。若 D₂ 导通，则 A = −6 V，电流从 +12 V 经 3 kΩ 流向 D₂，大小为 (12 − (−6))/3 kΩ = 6 mA。此时 D₁ 的阳极为 −6 V、阴极为 0 V，D₁ 截止。`)]});
Object.assign(detail['3.9'],{steps:[
 step('确定单管导通条件',`（a）输出为正时，稳压管反向偏置；当输出将要超过 5 V 时反向击穿，使 v<sub>o1</sub> 钳位于 +5 V。输出为负时，电压低于 −0.7 V 后正向导通，钳位于 −0.7 V。`),
 step('写出单管分段关系',`${eq('v<sub>o1</sub> = −0.7 V　（v<sub>i</sub> &lt; −0.7 V）')}${eq('v<sub>o1</sub> = v<sub>i</sub>　（−0.7 V ≤ v<sub>i</sub> ≤ 5 V）')}${eq('v<sub>o1</sub> = 5 V　（v<sub>i</sub> &gt; 5 V）')}`),
 step('确定双管限幅',`（b）两只稳压管反向串联：任一极性超过门限时，一只正向导通（0.7 V），另一只反向稳压（5 V），所以两侧限幅均为 5.7 V。${eq('v<sub>o2</sub> = max(−5.7 V, min(v<sub>i</sub>, 5.7 V))')}将 v<sub>i</sub> = 8 sin ωt 代入，得到下方波形。`)]});
Object.assign(detail['3-4'],{steps:[
 step('画出直流通路',`直流分析时两个耦合电容开路，信号源与负载被隔开；保留电源 V<sub>CC</sub>、基极偏置电阻 R<sub>b</sub> 和集电极电阻 R<sub>C</sub>。${pic('bjt-dc.svg','共射放大电路直流通路','图 1：直流通路')}`),
 step('计算静态工作点',`按老师参考答案的近似，忽略 V<sub>BE</sub>，先求基极电流：${eq(`I<sub>BQ</sub> ≈ ${fr('12 V','300 kΩ')} = 40 μA`)}${eq('I<sub>CQ</sub> = βI<sub>BQ</sub> = 50 × 40 μA = 2 mA')}${eq('U<sub>CEQ</sub> = 12 V − I<sub>CQ</sub>R<sub>C</sub> = 12 − 2 mA × 4 kΩ = 4 V')}因此 Q ≈ (I<sub>CQ</sub> = 2 mA，U<sub>CEQ</sub> = 4 V)。若取硅管 V<sub>BE</sub> ≈ 0.7 V，数值会略有不同。`),
 step('建立中频小信号等效电路',`耦合电容视为短路，直流电源为交流地；用 r<sub>be</sub> 和受控电流源 βi<sub>b</sub> 表示三极管。${pic('bjt-ac.svg','共射放大电路中频小信号等效电路','图 2：中频小信号等效电路')}集电极负载为 R<sub>C</sub> ∥ R<sub>L</sub>。按题解近似 I<sub>E</sub> ≈ I<sub>C</sub> = 2 mA、r<sub>bb′</sub> = 200 Ω：${eq(`r<sub>be</sub> ≈ r<sub>bb′</sub> + (1 + β) ${fr('26 mV','I<sub>E</sub>')} = 200 + 51 × ${fr('26 mV','2 mA')} = 863 Ω`)}`),
 step('计算电压增益',`R<sub>C</sub> ∥ R<sub>L</sub> = 4 kΩ ∥ 4 kΩ = 2 kΩ，因此${eq(`A<sub>v</sub> = −${fr('β(R<sub>C</sub> ∥ R<sub>L</sub>)','r<sub>be</sub>')} = −${fr('50 × 2000','863')} ≈ −115.87`)}`),
 step('求输入、输出电阻与源电压增益',`${eq(`R<sub>i</sub> = R<sub>b</sub> ∥ r<sub>be</sub> = 300 kΩ ∥ 863 Ω ≈ 861 Ω`)}忽略三极管输出电阻时，移除负载，从输出端向电路看 R<sub>o</sub> ≈ R<sub>C</sub> = 4 kΩ。${eq(`A<sub>vs</sub> = A<sub>v</sub>${fr('R<sub>i</sub>','R<sub>s</sub> + R<sub>i</sub>')} ≈ −115.87 × ${fr('861','500 + 861')} ≈ −73.3`)}若将 R<sub>i</sub> 近似为 863 Ω，则 A<sub>vs</sub> ≈ −73.36，与老师参考解的近似一致。`)], result:'I<sub>CQ</sub> ≈ 2 mA，U<sub>CEQ</sub> ≈ 4 V；A<sub>v</sub> ≈ −115.87，A<sub>vs</sub> ≈ −73.3；R<sub>i</sub> ≈ 861 Ω，R<sub>o</sub> ≈ 4 kΩ'});
Object.assign(detail['4-5'],{steps:[
 step('画直流分析思路并求栅极电位',`直流下各电容开路，MOS 管栅极电流近似为零，R<sub>G</sub> 内无直流电压降。R₂ = 80 kΩ 和 R₁ = 20 kΩ 将 15 V 分压：${eq(`V<sub>G</sub> = 15 × ${fr('20','80 + 20')} = 3 V`)}设 I<sub>D</sub> 的数值单位为 mA，则 V<sub>S</sub> = I<sub>D</sub> × 1 kΩ，V<sub>GS</sub> = 3 − I<sub>D</sub>（V）。`),
 step('建立方程并检验根',`先假设管子开启并工作在饱和区：${eq('I<sub>D</sub> = K<sub>n</sub>(V<sub>GS</sub> − V<sub>TN</sub>)² = (2 − I<sub>D</sub>)²')}${eq('I<sub>D</sub>² − 5I<sub>D</sub> + 4 = 0　⇒　I<sub>D</sub> = 1 或 4 mA')}4 mA 会给出 V<sub>GS</sub> = −1 V，低于阈值 1 V，不符合开启假设，应舍去。`),
 step('静态点及饱和条件',`${eq('I<sub>DQ</sub> = 1 mA，　V<sub>SQ</sub> = 1 V，　V<sub>GSQ</sub> = 2 V')}${eq('V<sub>DQ</sub> = 15 − 1 mA × 4 kΩ = 11 V，　V<sub>DSQ</sub> = 11 − 1 = 10 V')}因为 V<sub>DSQ</sub> = 10 V ≥ V<sub>GSQ</sub> − V<sub>TN</sub> = 1 V，饱和区假设成立。`),
 step('中频小信号参数',`中频时 C₁、C₂、C<sub>S</sub> 近似短路，源极交流接地；电源为交流地。${pic('mos-ac.svg','共源放大器的中频等效电路','中频等效：源极交流接地，栅极不取电流')}忽略沟道长度调制：${eq('g<sub>m</sub> = 2K<sub>n</sub>(V<sub>GSQ</sub> − V<sub>TN</sub>) = 2 mS')}${eq('A<sub>v</sub> = −g<sub>m</sub>R<sub>D</sub> = −2 mS × 4 kΩ = −8')}${eq('R<sub>i</sub> = R<sub>G</sub> + (R₁ ∥ R₂) = 100 + 16 = 116 kΩ，　R<sub>o</sub> ≈ R<sub>D</sub> = 4 kΩ')}这里的 v<sub>i</sub> 取图中的外部输入端，故输入电阻包括串联的 R<sub>G</sub>。`)],result:'I<sub>DQ</sub> = 1 mA，V<sub>GSQ</sub> = 2 V，V<sub>DSQ</sub> = 10 V；A<sub>v</sub> ≈ −8，R<sub>i</sub> ≈ 116 kΩ，R<sub>o</sub> ≈ 4 kΩ'});
Object.assign(detail['6.6'],{description:'图示电路中，T₁、T₂ 为硅管且 β₁ = β₂ = 50。求：（1）静态时的 I<sub>C1</sub>、V<sub>C1</sub>；（2）差模电压增益 A<sub>vd1</sub>、共模电压增益 A<sub>vc1</sub>；（3）当 v<sub>i</sub> = 10 mV 时的输出电压 v<sub>o</sub>。',steps:[
 step('说明近似与输出定义',`取硅管 V<sub>BE</sub> ≈ 0.7 V，I<sub>E</sub> ≈ I<sub>C</sub>，忽略基极电流在 1 kΩ 电阻上的直流压降。题图未给出 r<sub>bb′</sub>，这里假设 300 Ω；增益数值会随课堂所用参数而改变。图中输出取 T₁ 集电极对地。`),
 step('计算静态电流与集电极电位',`两管对称，基极近似为 0 V，公共发射极约为 −0.7 V。尾电流及每管电流为${eq(`I<sub>E1</sub> ≈ I<sub>E2</sub> ≈ ${fr('12 − 0.7','2 × 15.3 kΩ')} = 0.369 mA`)}${eq('I<sub>C1</sub> ≈ 0.369 mA，　V<sub>C1</sub> ≈ 12 − 0.369 mA × 10 kΩ = 8.31 V')}`),
 step('计算小信号输入电阻',`${eq(`r<sub>be</sub> ≈ r<sub>bb′</sub> + (1 + β)${fr('26 mV','I<sub>E</sub>')} ≈ 300 Ω + 51 × ${fr('26 mV','0.369 mA')} ≈ 3.89 kΩ`)}`),
 step('差模和共模增益',`定义 v<sub>id</sub> = v<sub>i1</sub> − v<sub>i2</sub>、v<sub>ic</sub> = (v<sub>i1</sub> + v<sub>i2</sub>)/2。两侧串联基极电阻均为 1 kΩ；差模时公共发射极为交流虚地，共模时尾电阻折算到半电路为 2R<sub>E</sub>。${pic('diff-half.svg','差动放大器左侧半电路','左侧半电路：差模 ZE = 0，共模 ZE = 2RE')}${eq(`A<sub>vd1</sub> ≈ −${fr('βR<sub>C</sub>','2(R<sub>b</sub> + r<sub>be</sub>)')} ≈ −51.1`)}${eq(`A<sub>vc1</sub> ≈ −${fr('βR<sub>C</sub>','R<sub>b</sub> + r<sub>be</sub> + 2(1 + β)R<sub>E</sub>')} ≈ −0.319`)}`),
 step('单端输入 10 mV 时求输出',`图中 v<sub>i1</sub> = v<sub>i</sub>，右侧输入交流接地，即 v<sub>i2</sub> = 0；因此 v<sub>id</sub> = v<sub>i</sub>、v<sub>ic</sub> = v<sub>i</sub>/2。${eq('v<sub>o</sub> = A<sub>vd1</sub>v<sub>id</sub> + A<sub>vc1</sub>v<sub>ic</sub>')}${eq('v<sub>o</sub> ≈ (−51.1 − 0.319/2) × 10 mV ≈ −0.513 V')}这里是交流输出分量；若要求集电极瞬时总电位，还需加上约 8.31 V 的静态电位。`)],result:'I<sub>C1</sub> ≈ 0.369 mA；V<sub>C1</sub> ≈ 8.31 V；A<sub>vd1</sub> ≈ −51.1；A<sub>vc1</sub> ≈ −0.319；v<sub>o</sub> ≈ −0.513 V（参数假设见解答）'});
for (const id of ['3.7','3.9','3-4','4-5']) detail[id].source='参考学习通答案 · 推导补充';
