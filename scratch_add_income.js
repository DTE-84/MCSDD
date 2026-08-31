const fs = require('fs'); let html = fs.readFileSync('index.html', 'utf8'); const replacement = \            <div class=\"field-group full\">
              <div class=\"subsection-label\" style=\"margin-top: 15px;\">Personal Income</div>
              
              <label class=\"eth-check\" style=\"margin-bottom: 10px;\">
                <input type=\"checkbox\" id=\"unemployedCheck\" onchange=\"updatePersonalIncomeUI(); updateUI();\"> Unemployed
              </label>

              <div id=\"personalIncomeWrapper\">
                <div class=\"multi-select-container\" id=\"personalIncomeContainer\">
                  <div class=\"multi-select-display\" onclick=\"toggleMultiSelect('personalIncomeContainer')\">
                    <div class=\"selected-tags\" id=\"personalIncomeTags\">
                      <span class=\"placeholder\">Select options...</span>
                    </div>
                  </div>
                  <div class=\"multi-select-dropdown\">
                    <label class=\"multi-option\"><input type=\"checkbox\" id=\"incomeEmployedCheck\" value=\"Employed\" onchange=\"updatePersonalIncomeUI(); updateUI();\"><span>If employed, individual's earned income from employment and what supports needed to manage such income.</span></label>
                    <label class=\"multi-option\"><input type=\"checkbox\" id=\"incomeMaintainCheck\" value=\"Maintain Benefits\" onchange=\"updatePersonalIncomeUI(); updateUI();\"><span>Supports needed to maintain benefits(Waiver recipients only).</span></label>
                    <label class=\"multi-option\"><input type=\"checkbox\" id=\"incomeOwnPayeeCheck\" value=\"Own Payee\" onchange=\"updatePersonalIncomeUI(); updateUI();\"><span>Supports needed if person serves as their own payee, either natural or paid, in order to assist the individual to manage funds (Waiver recipients only).</span></label>
                    <label class=\"multi-option\"><input type=\"checkbox\" id=\"incomeHasPayeeCheck\" value=\"Has Payee\" onchange=\"updatePersonalIncomeUI(); updateUI();\"><span>If individual has payee, provide information on this.</span></label>
                  </div>
                </div>
              </div>

              <div id=\"incomeEmployedFields\" style=\"display: none; margin-top: 10px; padding-left: 15px; border-left: 2px solid var(--border);\">
                <label>Earned Income & Supports Needed</label>
                <textarea id=\"incomeEmployedText\" placeholder=\"Amount of earned income and what supports are needed to manage such income\" oninput=\"updateUI()\"></textarea>
              </div>

              <div id=\"incomeMaintainFields\" style=\"display: none; margin-top: 10px; padding-left: 15px; border-left: 2px solid var(--border);\">
                <label>Income Amount</label>
                <input type=\"text\" id=\"incomeMaintainAmount\" placeholder=\"Income amount\" oninput=\"updateUI()\" style=\"margin-bottom: 8px;\">
                <label>Supports Needed</label>
                <textarea id=\"incomeMaintainSupports\" placeholder=\"supports needed to manage such income\" oninput=\"updateUI()\"></textarea>
              </div>

              <div id=\"incomeOwnPayeeFields\" style=\"display: none; margin-top: 10px; padding-left: 15px; border-left: 2px solid var(--border);\">
                <label>Income Amount</label>
                <input type=\"text\" id=\"incomeOwnPayeeAmount\" placeholder=\"Income amount\" oninput=\"updateUI()\" style=\"margin-bottom: 8px;\">
                <label>Supports Needed</label>
                <textarea id=\"incomeOwnPayeeSupports\" placeholder=\"supports needed to manage such income\" oninput=\"updateUI()\"></textarea>
              </div>

              <div id=\"incomeHasPayeeFields\" style=\"display: none; margin-top: 10px; padding-left: 15px; border-left: 2px solid var(--border);\">
                <p style=\"font-size: 13px; color: var(--accent); margin: 0; font-weight: 600;\">Refer to Demographics section under Payee</p>
              </div>
            </div>\; const search = '<textarea id=\"culturalDifferences\" placeholder=\"Person does not believe in certain holidays, programs, celebrations, etc.\" oninput=\"updateUI()\"></textarea>\\n            </div>'; html = html.replace(search, search + '\\n' + replacement); fs.writeFileSync('index.html', html);
