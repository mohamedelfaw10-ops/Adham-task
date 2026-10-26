const $ = id => document.getElementById(id);

let questions = [];
let index = 0;
let score = 0;
let answered = false;
let wrong = [];

const bank = {
  "اللغة العربية": [
    { q: "ما نوع كلمة «مدرسة»؟", a: ["فعل", "اسم", "حرف", "ضمير"], c: 1 },
    { q: "ما جمع كلمة «كتاب»؟", a: ["كاتب", "مكتبة", "كتب", "كتابات"], c: 2 }
  ],
  "اللغة الإنجليزية": [
    { q: "Choose: She ... a student.", a: ["am", "is", "are", "be"], c: 1 },
    { q: "What is the past of go?", a: ["Goed", "Going", "Went", "Goes"], c: 2 }
  ],
  "اللغة الفرنسية": [
    { q: "What does «Bonjour» mean?", a: ["Goodbye", "Hello", "Thanks", "Please"], c: 1 }
  ],
  "الرياضيات": [
    { q: "ما ناتج 5 × 6؟", a: ["11", "25", "30", "35"], c: 2 },
    { q: "حل المعادلة س + 4 = 10", a: ["4", "5", "6", "14"], c: 2 }
  ],
  "العلوم": [
    { q: "ما الكوكب الذي نعيش عليه؟", a: ["المريخ", "الأرض", "الزهرة", "المشتري"], c: 1 },
    { q: "ما الغاز الذي يحتاجه الإنسان للتنفس؟", a: ["الأكسجين", "الهيليوم", "الهيدروجين", "النيتروجين فقط"], c: 0 }
  ],
  "الدراسات الاجتماعية": [
    { q: "ما عاصمة مصر؟", a: ["الإسكندرية", "القاهرة", "الأقصر", "أسوان"], c: 1 },
    { q: "في أي قارة تقع مصر؟", a: ["أوروبا", "آسيا فقط", "أفريقيا", "أمريكا"], c: 2 }
  ],
  "التربية الدينية": [
    { q: "كم عدد أركان الإسلام؟", a: ["ثلاثة", "أربعة", "خمسة", "ستة"], c: 2 }
  ],
  "الكمبيوتر وتكنولوجيا المعلومات": [
    { q: "ما اللغة المستخدمة لتنسيق صفحات الويب؟", a: ["CSS", "HTML فقط", "SQL", "Python فقط"], c: 0 }
  ],
  "التربية الفنية": [
    { q: "ما الألوان الأساسية في الرسم التقليدي؟", a: ["أحمر وأصفر وأزرق", "أبيض وأسود فقط", "أخضر وبنفسجي", "رمادي وبني"], c: 0 }
  ],
  "المهارات المهنية": [
    { q: "ما التصرف الصحيح عند استخدام أداة حادة؟", a: ["استخدامها بحذر", "الجري بها", "تركها على الأرض", "توجيهها للآخرين"], c: 0 }
  ]
};

$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("username").value.trim();
  $("welcome").textContent = "أهلاً بك يا " + name + " 👋";
  $("login").hidden = true;
  $("app").hidden = false;
});

function logout() {
  $("app").hidden = true;
  $("login").hidden = false;
}

function startQuiz() {
  const subject = $("subject").value;
  const grade = $("grade").value;
  const term = $("term").value;

  questions = (bank[subject] || []).map(q => ({ ...q }));
  index = 0;
  score = 0;
  wrong = [];

  $("result").hidden = true;
  $("quiz").hidden = false;

  if (!questions.length) {
    $("question").textContent = "لا توجد أسئلة لهذه المادة حتى الآن.";
    $("questionNumber").textContent = "";
    $("answers").replaceChildren();
    $("feedback").textContent = "أضف أسئلة إلى بنك هذه المادة في ملف JavaScript.";
    $("next").hidden = true;
    return;
  }

  // الأسئلة الحالية تجريبية، وليست مخصصة للصف أو الترم.
  showQuestion();
}

function showQuestion() {
  answered = false;
  const q = questions[index];

  $("questionNumber").textContent =
    `السؤال ${index + 1} من ${questions.length}`;

  $("question").textContent = q.q;
  $("feedback").textContent = "";
  $("answers").replaceChildren();
  $("next").hidden = true;

  q.a.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(i);
    $("answers").appendChild(btn);
  });
}

function checkAnswer(choice) {
  if (answered) return;
  answered = true;

  const q = questions[index];
  const buttons = $("answers").querySelectorAll("button");

  buttons.forEach(btn => btn.disabled = true);

  if (choice === q.c) {
    score++;
    $("feedback").textContent = "إجابة صحيحة! ✅";
    $("feedback").style.color = "green";
  } else {
    wrong.push(q.q);
    $("feedback").textContent =
      "إجابة غير صحيحة ❌ الإجابة الصحيحة: " + q.a[q.c];
    $("feedback").style.color = "red";
  }

  $("next").hidden = false;
  $("next").textContent =
    index === questions.length - 1 ? "عرض النتيجة" : "السؤال التالي";
}

function nextQuestion() {
  if (!answered) return;

  index++;

  if (index < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  $("quiz").hidden = true;
  $("result").hidden = false;

  const percent = Math.round(score / questions.length * 100);
  $("score").textContent =
    `درجتك ${score} من ${questions.length} (${percent}%)`;

  $("review").textContent = wrong.length
    ? "راجع الأسئلة التي أخطأت فيها: " + wrong.join(" — ")
    : "ممتاز! أجبت عن كل الأسئلة بشكل صحيح.";

  const count = Number(localStorage.getItem("examCount") || 0) + 1;
  localStorage.setItem("examCount", count);
  localStorage.setItem("lastScore", percent);

  $("examCount").textContent = count;
  $("lastScore").textContent = percent + "%";
}

$("examCount").textContent = localStorage.getItem("examCount") || 0;
$("lastScore").textContent =
  localStorage.getItem("lastScore") === null
    ? "-"
    : localStorage.getItem("lastScore") + "%";