

const auth = {
    // טעינת משתמשים מה-Local Storage
    users: JSON.parse(localStorage.getItem('users')) || [{ user: "אורח", pass: "1234", email: "guest@chef.com" }],

    validate(u, p, e = null) {
        let ok = true;
        const isLetters = (s) => /^[a-zA-Zא-ת\s]+$/.test(s);
        const hasNum = (s) => /\d/.test(s);

        if (!u.value || !isLetters(u.value)) { ui.setError(u, "שם באותיות בלבד"); ok = false; }
        if (!p.value || !hasNum(p.value)) { ui.setError(p, "סיסמה עם מספרים"); ok = false; }
        if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value)) { ui.setError(e, "אימייל לא תקין"); ok = false; }
        return ok;
    },

    login() {
        const u = document.getElementById('login-user'), p = document.getElementById('login-pass');
        if (!this.validate(u, p)) return;

        const found = this.users.find(x => x.user === u.value && x.pass === p.value);
        if (found) {
            ui.showToast("נכנסת! ✨");
            setTimeout(() => ui.navigateTo('recipes-screen'), 400);
        } else {
            ui.showToast("לא מוכרת? עוברת להרשמה...");
            setTimeout(() => {
                ui.navigateTo('register-screen');
                document.getElementById('reg-name').value = u.value;
                document.getElementById('reg-pass').value = p.value;
            }, 450);
        }
    },

    register() {
        const n = document.getElementById('reg-name'), e = document.getElementById('reg-email'), p = document.getElementById('reg-pass');
        
        // בדיקת תקינות תווים
        if (!this.validate(n, p, e)) return;

        // בדיקת אימייל ייחודי - הצגת שגיאה בתוך השדה באדום
        const emailExists = this.users.some(x => x.email === e.value);
        if (emailExists) {
            ui.setError(e, "אימייל זה בשימוש"); 
            return;
        }

        this.users.push({ user: n.value, pass: p.value, email: e.value });
        localStorage.setItem('users', JSON.stringify(this.users));
        ui.showToast("נרשמת! 👩‍🍳");
        setTimeout(() => ui.navigateTo('recipes-screen'), 400);
    }
};

const ui = {
    recipes: [
        { title: "חלה לשבת 🍞", ingredients: "קילו קמח, 2 כפות שמרים, חצי כוס סוכר, כף מלח, חצי כוס שמן, 2.5 כוסות מים", steps: "מערבבים חומרים יבשים.\nמוסיפים מים ושמן ולשים 10 דקות.\nמתפיחים שעה וחצי.\nקולעים צמות ואופים ב-180 מעלות עד להזהבה." },
        { title: "מרק כתום 🥣", ingredients: "דלעת, בטטה, גזר, בצל, מלח, פלפל, מעט קינמון", steps: "מטגנים בצל.\nמוסיפים ירקות חתוכים ומים עד לכיסוי.\nמבשלים עד ריכוך.\nטוחנים בבלנדר מוט." },
        { title: "עוגיות שוקולד צ'יפס 🍪", ingredients: "2 כוסות קמח, כוס סוכר, חצי כוס שמן, ביצה, כפית תמצית וניל, חבילת נטיפי שוקולד", steps: "מערבבים את כל החומרים לבצק אחיד.\nיוצרים כדורים קטנים.\nאופים ב-180 מעלות למשך 10-12 דקות." },
        { title: "שקשוקה ביתית 🍳", ingredients: "4 עגבניות, 2 כפות רסק, 3 שיני שום, פפריקה, מלח, 4 ביצים", steps: "מבשלים עגבניות ושום במחבת.\nמוסיפים רסק ותבלינים.\nשוברים את הביצים פנימה.\nמכסים ומבשלים עד שהביצים מוכנות." },
        { title: "אורז אחד אחד 🍚", ingredients: "2 כוסות אורז, 4 כוסות מים רותחים, 3 כפות שמן, כפית מלח", steps: "מטגנים את האורז בשמן.\nמוסיפים מים רותחים ומלח.\nמנמיכים להבה ומכסים.\nמבשלים 18 דקות בדיוק." },
        { title: "סלט ירקות עשיר 🥗", ingredients: "מלפפון, עגבניה, פלפל, בצל סגול, חסה, לימון, שמן זית, מלח", steps: "קוצצים את כל הירקות דק.\nמערבבים בקערה.\nמתבלים סמוך להגשה." },
        { title: "פסטה ברוטב עגבניות 🍝", ingredients: "חבילת פסטה, בצל, שום, רסק עגבניות, אורגנו, מלח", steps: "מבשלים פסטה לפי ההוראות.\nמכינים רוטב מבצל, שום ורסק.\nמערבבים יחד ומגישים חם." },
        { title: "תפוחי אדמה בתנור 🥔", ingredients: "5 תפוחי אדמה, שמן זית, פפריקה, מלח גס, רוזמרין", steps: "חותכים לקוביות.\nמתבלים בשמן ותבלינים.\nצולים ב-200 מעלות עד שפריך." },
        { title: "לביבות גבינה 🥞", ingredients: "250 גרם גבינה לבנה, 2 ביצים, 3 כפות סוכר, חצי כוס קמח", steps: "מערבבים הכל בקערה.\nמחממים מחבת עם מעט שמן.\nמטגנים שלוליות קטנות עד להזהבה משני הצדדים." },
        { title: "שייק פירות מרענן 🥤", ingredients: "בננה, תמר, כוס חלב או מים, קרח", steps: "מכניסים הכל לבלנדר.\nטוחנים עד למרקם חלק.\nמוזגים לכוס גבוהה." },
        { title: "דג מושט בתנור 🐟", ingredients: "פילה מושט, לימון, שום כתוש, פפריקה, שמן זית", steps: "משרים את הדג בלימון.\nמורחים שום ותבלינים.\nאופים 20 דקות ב-190 מעלות." },
        { title: "קציצות ירק 🌿", ingredients: "קישוא, תפוח אדמה, בצל, פטרוזיליה, 2 ביצים, חצי כוס פירורי לחם", steps: "מגרדים ירקות וסוחטים מנוזלים.\nמערבבים עם שאר החומרים.\nמטגנים או אופים עד להזהבה." }
    ],
    currentRecipe: null,

    navigateTo(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
        if (id === 'recipes-screen') this.renderRecipes();
        speech.stop(); 
    },

    setError(el, msg) {
        el.value = ""; el.placeholder = msg; el.classList.add('error-field');
        el.onfocus = () => el.classList.remove('error-field');
    },

    showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    },

    renderRecipes() {
        const list = document.getElementById('recipe-list');
        list.innerHTML = this.recipes.map((r, i) => `
            <div class="recipe-item-row" onclick="ui.openRecipe(${i})">
                <span>⭐</span> <span>${r.title}</span>
            </div>
        `).join('');
    },

    openRecipe(index) {
        const r = this.recipes[index];
        this.currentRecipe = r;
        document.getElementById('view-title').innerText = r.title || "";
        document.getElementById('view-ingredients').innerText = r.ingredients || "אין מצרכים";
        document.getElementById('view-steps').innerText = r.steps || "";
        this.navigateTo('view-recipe-screen');
    },

    toggleSettings(show) {
        document.getElementById('settings-modal').classList.toggle('active', show);
    },

    setTheme() {
        document.body.classList.toggle('light-mode');
        this.showToast("העיצוב השתנה!");
    },

    filter() {
        const q = document.getElementById('recipe-search').value.toLowerCase();
        document.querySelectorAll('.recipe-item-row').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
        });
    }
};

const logic = {
    saveRecipe() {
        const t = document.getElementById('new-recipe-title');
        const i = document.getElementById('new-recipe-ingredients');
        const s = document.getElementById('new-recipe-steps');
        if (!t.value) return ui.showToast("חובה לתת שם!");
        ui.recipes.push({ title: t.value + " ✨", ingredients: i.value, steps: s.value });
        localStorage.setItem('recipes', JSON.stringify(ui.recipes));
        ui.showToast("המתכון נשמר! ✅");
        t.value = ""; i.value = ""; s.value = "";
        ui.navigateTo('recipes-screen');
    }
};

const speech = {
    synth: window.speechSynthesis,
    isSpeaking: false,

    async speakCurrent() {
        this.stop();
        this.isSpeaking = true;
        
        // קריאת זמן השהיה מהגדרות
        const delay = parseInt(document.getElementById('delay-range').value) || 1000;
        
        // פונקציה לניקוי אמוג'ים מהטקסט
        const clean = (txt) => txt.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

        // הקראת כותרת ומצרכים
        await this.speakLine("המתכון ל" + clean(ui.currentRecipe.title));
        await this.speakLine("המצרכים הם: " + clean(ui.currentRecipe.ingredients));
        if (!this.isSpeaking) return;
        await new Promise(r => setTimeout(r, delay));

        // הקראת שלבים שורה אחר שורה
        const steps = ui.currentRecipe.steps.split('\n');
        for (let step of steps) {
            if (!this.isSpeaking) break;
            if (step.trim() === "") continue;
            await this.speakLine(clean(step));
            await new Promise(r => setTimeout(r, delay));
        }
        this.isSpeaking = false;
    },

    speakLine(text) {
        return new Promise((resolve) => {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'he-IL';
            utter.rate = 0.9;
            utter.onend = resolve;
            this.synth.speak(utter);
        });
    },

    pause() {
        if (this.synth.speaking) this.synth.pause();
    },

    resume() {
        if (this.synth.paused) this.synth.resume();
    },

    stop() {
        this.isSpeaking = false;
        this.synth.cancel();
    }
};

ui.renderRecipes();