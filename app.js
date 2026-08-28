"use strict";

/* ==================================================
   ESTUDAPLUS
   VERSÃO SEM FIREBASE

   Os dados são armazenados temporariamente
   no localStorage do navegador.

   Firebase será integrado posteriormente.
================================================== */


/* ==================================================
   ESTADO
================================================== */

let currentUser = null;

let currentCourse = null;

let currentLesson = null;

let currentQuiz = null;

let currentQuizAnswers = {};



/* ==================================================
   DADOS INICIAIS
================================================== */

const defaultCourses = [

    {
        id: "curso-1",

        title: "Informática Básica",

        description:
            "Aprenda os principais conceitos de informática e tecnologia.",

        lessons: [

            {
                id: "aula-1",

                title: "Introdução à informática",

                description:
                    "Conheça os conceitos fundamentais.",

                content:
                    "Nesta aula você aprenderá os principais conceitos de informática, computadores, sistemas e tecnologia.",

                video: ""
            },


            {
                id: "aula-2",

                title: "Hardware e software",

                description:
                    "Entenda a diferença entre hardware e software.",

                content:
                    "Hardware representa as partes físicas de um computador. Software representa os programas e sistemas utilizados pelo equipamento.",

                video: ""
            },


            {
                id: "aula-3",

                title: "Internet e segurança",

                description:
                    "Aprenda conceitos básicos de segurança digital.",

                content:
                    "A internet permite a comunicação e o acesso a informações. Sempre utilize senhas fortes e tenha cuidado com links desconhecidos.",

                video: ""
            }

        ]

    },


    {
        id: "curso-2",

        title: "Matemática Fundamental",

        description:
            "Revise conceitos importantes de matemática.",

        lessons: [

            {
                id: "aula-4",

                title: "Operações básicas",

                description:
                    "Adição, subtração, multiplicação e divisão.",

                content:
                    "As quatro operações fundamentais são essenciais para a resolução de problemas matemáticos.",

                video: ""
            },


            {
                id: "aula-5",

                title: "Frações",

                description:
                    "Aprenda os conceitos básicos de frações.",

                content:
                    "Uma fração representa uma parte de um todo. Ela possui numerador e denominador.",

                video: ""
            }

        ]

    },


    {
        id: "curso-3",

        title: "Redação",

        description:
            "Aprenda como estruturar e desenvolver uma boa redação.",

        lessons: [

            {
                id: "aula-6",

                title: "Estrutura da redação",

                description:
                    "Introdução, desenvolvimento e conclusão.",

                content:
                    "Uma redação organizada normalmente apresenta introdução, desenvolvimento e conclusão.",

                video: ""
            },


            {
                id: "aula-7",

                title: "Argumentação",

                description:
                    "Como desenvolver argumentos.",

                content:
                    "Uma boa argumentação apresenta ideias claras, justificativas e exemplos relacionados ao tema.",

                video: ""
            }

        ]

    }

];


const defaultQuizzes = [

    {
        id: "simulado-1",

        title: "Informática Básica",

        description:
            "Teste seus conhecimentos de informática.",

        questions: [

            {
                id: "q1",

                question:
                    "Qual destes é um exemplo de hardware?",

                options: [

                    "Monitor",

                    "Sistema operacional",

                    "Navegador",

                    "Aplicativo"

                ],

                answer: 0

            },


            {
                id: "q2",

                question:
                    "Qual destes é um software?",

                options: [

                    "Teclado",

                    "Mouse",

                    "Sistema operacional",

                    "Monitor"

                ],

                answer: 2

            },


            {
                id: "q3",

                question:
                    "Qual atitude aumenta a segurança digital?",

                options: [

                    "Usar a mesma senha em todos os sites",

                    "Compartilhar senhas",

                    "Clicar em qualquer link",

                    "Usar senhas fortes"

                ],

                answer: 3

            }

        ]

    },


    {
        id: "simulado-2",

        title: "Conhecimentos Gerais",

        description:
            "Avalie seus conhecimentos gerais.",

        questions: [

            {
                id: "q4",

                question:
                    "Quantos dias aproximadamente possui um ano?",

                options: [

                    "100",

                    "200",

                    "365",

                    "500"

                ],

                answer: 2

            },


            {
                id: "q5",

                question:
                    "Qual é o resultado de 5 + 5?",

                options: [

                    "8",

                    "10",

                    "15",

                    "20"

                ],

                answer: 1

            }

        ]

    }

];



/* ==================================================
   STORAGE
================================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem(
            "estudaplus_users"
        ) || "[]"
    );

}


function saveUsers(users) {

    localStorage.setItem(
        "estudaplus_users",
        JSON.stringify(users)
    );

}


function getCourses() {

    const saved =
        localStorage.getItem(
            "estudaplus_courses"
        );


    if (!saved) {

        saveCourses(defaultCourses);

        return defaultCourses;

    }


    return JSON.parse(saved);

}


function saveCourses(courses) {

    localStorage.setItem(
        "estudaplus_courses",
        JSON.stringify(courses)
    );

}


function getQuizzes() {

    const saved =
        localStorage.getItem(
            "estudaplus_quizzes"
        );


    if (!saved) {

        localStorage.setItem(
            "estudaplus_quizzes",
            JSON.stringify(defaultQuizzes)
        );

        return defaultQuizzes;

    }


    return JSON.parse(saved);

}


function getProgress() {

    if (!currentUser) {

        return {};

    }


    return JSON.parse(
        localStorage.getItem(
            "estudaplus_progress_" +
            currentUser.id
        ) || "{}"
    );

}


function saveProgress(progress) {

    if (!currentUser) {
        return;
    }


    localStorage.setItem(
        "estudaplus_progress_" +
        currentUser.id,

        JSON.stringify(progress)
    );

}



/* ==================================================
   UTILITÁRIOS
================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function initials(name) {

    return String(name || "U")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word => word.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },

        2500
    );

}



/* ==================================================
   AUTH
================================================== */

function initializeAuth() {

    const session =
        localStorage.getItem(
            "estudaplus_session"
        );


    if (session) {

        const users =
            getUsers();


        currentUser =
            users.find(
                user =>
                    user.id === session
            ) || null;

    }


    if (currentUser) {

        showApp();

    } else {

        showAuth();

    }

}


function showAuth() {

    document
        .getElementById(
            "authScreen"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "app"
        )
        .classList.add(
            "hidden"
        );

}


function showApp() {

    document
        .getElementById(
            "authScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "app"
        )
        .classList.remove(
            "hidden"
        );


    updateUserInterface();

    renderDashboard();

    showPage(
        "dashboard"
    );

}


function register() {

    const name =
        document
            .getElementById(
                "registerName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            .value;


    const message =
        document
            .getElementById(
                "registerMessage"
            );


    if (
        name.length < 2
    ) {

        message.textContent =
            "Digite seu nome completo.";

        return;

    }


    if (
        !email.includes("@")
    ) {

        message.textContent =
            "Digite um e-mail válido.";

        return;

    }


    if (
        password.length < 6
    ) {

        message.textContent =
            "A senha deve possuir pelo menos 6 caracteres.";

        return;

    }


    const users =
        getUsers();


    if (
        users.some(
            user =>
                user.email === email
        )
    ) {

        message.textContent =
            "Este e-mail já está cadastrado.";

        return;

    }


    /*
     * Primeiro usuário criado vira administrador
     * somente nesta versão local de demonstração.
     *
     * Quando Firebase for integrado,
     * essa lógica será substituída pelas
     * permissões do Firebase.
     */

    const isFirstUser =
        users.length === 0;


    const user = {

        id:
            "user-" +
            Date.now(),

        name,

        email,

        password,

        role:
            isFirstUser
                ? "admin"
                : "aluno"

    };


    users.push(
        user
    );


    saveUsers(
        users
    );


    currentUser =
        user;


    localStorage.setItem(
        "estudaplus_session",
        user.id
    );


    message.textContent =
        "";


    showApp();


    showToast(
        "Conta criada com sucesso!"
    );

}


function login() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    const message =
        document
            .getElementById(
                "loginMessage"
            );


    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        message.textContent =
            "E-mail ou senha incorretos.";

        return;

    }


    message.textContent =
        "";


    currentUser =
        user;


    localStorage.setItem(
        "estudaplus_session",
        user.id
    );


    showApp();


    showToast(
        "Login realizado!"
    );

}


function logout() {

    currentUser =
        null;


    localStorage.removeItem(
        "estudaplus_session"
    );


    showAuth();

}



/* ==================================================
   INTERFACE DO USUÁRIO
================================================== */

function updateUserInterface() {

    if (!currentUser) {
        return;
    }


    const name =
        currentUser.name ||
        "Usuário";


    document
        .getElementById(
            "headerUserName"
        )
        .textContent =
        name;


    document
        .getElementById(
            "headerUserRole"
        )
        .textContent =
        currentUser.role === "admin"
            ? "Administrador"
            : "Aluno";


    document
        .getElementById(
            "headerAvatar"
        )
        .textContent =
        initials(name);


    document
        .getElementById(
            "dashboardName"
        )
        .textContent =
        name.split(" ")[0];


    document
        .getElementById(
            "profileName"
        )
        .textContent =
        name;


    document
        .getElementById(
            "profileEmail"
        )
        .textContent =
        currentUser.email;


    document
        .getElementById(
            "profileRole"
        )
        .textContent =
        currentUser.role === "admin"
            ? "Administrador"
            : "Aluno";


    document
        .getElementById(
            "profileAvatar"
        )
        .textContent =
        initials(name);


    document
        .getElementById(
            "profileNameInput"
        )
        .value =
        name;


    const adminNav =
        document
            .getElementById(
                "adminNav"
            );


    if (
        currentUser.role === "admin"
    ) {

        adminNav.classList.remove(
            "hidden"
        );

    } else {

        adminNav.classList.add(
            "hidden"
        );

    }

}



/* ==================================================
   NAVEGAÇÃO
================================================== */

function showPage(pageName) {

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );


    const page =
        document.getElementById(
            "page-" +
            pageName
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(
            ".nav-item[data-page]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",

                    button.dataset.page ===
                    pageName
                );

            }
        );


    document
        .getElementById(
            "sidebar"
        )
        .classList.remove(
            "open"
        );


    window.scrollTo(
        0,
        0
    );


    if (
        pageName === "dashboard"
    ) {

        renderDashboard();

    }


    if (
        pageName === "courses"
    ) {

        renderCourses();

    }


    if (
        pageName === "simulados"
    ) {

        renderQuizzes();

    }


    if (
        pageName === "progresso"
    ) {

        renderProgressPage();

    }


    if (
        pageName === "admin"
    ) {

        if (
            currentUser?.role !==
            "admin"
        ) {

            showToast(
                "Acesso permitido somente ao administrador."
            );

            showPage(
                "dashboard"
            );

            return;

        }


        renderAdmin();

    }

}


function navigateFromButton(event) {

    const page =
        event.currentTarget.dataset.goPage;


    if (page) {

        showPage(
            page
        );

    }

}



/* ==================================================
   PROGRESSO
================================================== */

function getCourseProgress(course) {

    const progress =
        getProgress();


    if (
        !course.lessons ||
        course.lessons.length === 0
    ) {

        return 0;

    }


    let completed = 0;


    course.lessons.forEach(
        lesson => {

            if (
                progress[
                    lesson.id
                ] === true
            ) {

                completed++;

            }

        }
    );


    return Math.round(
        (
            completed /
            course.lessons.length
        ) * 100
    );

}


function isLessonCompleted(
    lessonId
) {

    const progress =
        getProgress();


    return (
        progress[
            lessonId
        ] === true
    );

}


function toggleLessonCompletion(
    lessonId
) {

    const progress =
        getProgress();


    progress[
        lessonId
    ] =
        !(
            progress[
                lessonId
            ] === true
        );


    saveProgress(
        progress
    );


    renderLesson();


    showToast(
        progress[
            lessonId
        ]
        ?
        "Aula concluída!"
        :
        "Aula marcada como não concluída."
    );

}



/* ==================================================
   DASHBOARD
================================================== */

function renderDashboard() {

    if (!currentUser) {
        return;
    }


    const courses =
        getCourses();


    const quizzes =
        getQuizzes();


    let completedLessons =
        0;


    let progressTotal =
        0;


    courses.forEach(
        course => {

            const progress =
                getCourseProgress(
                    course
                );


            progressTotal +=
                progress;


            course.lessons.forEach(
                lesson => {

                    if (
                        isLessonCompleted(
                            lesson.id
                        )
                    ) {

                        completedLessons++;

                    }

                }
            );

        }
    );


    const averageProgress =
        courses.length
            ?
            Math.round(
                progressTotal /
                courses.length
            )
            :
            0;


    document
        .getElementById(
            "statCourses"
        )
        .textContent =
        courses.length;


    document
        .getElementById(
            "statLessons"
        )
        .textContent =
        completedLessons;


    document
        .getElementById(
            "statProgress"
        )
        .textContent =
        averageProgress +
        "%";


    const history =
        JSON.parse(
            localStorage.getItem(
                "estudaplus_quiz_history_" +
                currentUser.id
            ) || "[]"
        );


    document
        .getElementById(
            "statQuizzes"
        )
        .textContent =
        history.length;


    renderDashboardCourses();

    renderDashboardQuizzes();

}


function renderDashboardCourses() {

    const container =
        document
            .getElementById(
                "dashboardCourses"
            );


    const courses =
        getCourses();


    container.innerHTML =
        courses
            .slice(0, 3)
            .map(
                createCourseCard
            )
            .join("");

}


function renderDashboardQuizzes() {

    const container =
        document
            .getElementById(
                "dashboardQuizzes"
            );


    const quizzes =
        getQuizzes();


    container.innerHTML =
        quizzes
            .slice(0, 3)
            .map(
                createQuizCard
            )
            .join("");

}



/* ==================================================
   CURSOS
================================================== */

function createCourseCard(
    course
) {

    const progress =
        getCourseProgress(
            course
        );


    return `

        <article class="course-card">

            <div class="course-cover">
                📚
            </div>

            <div class="course-body">

                <h3>
                    ${escapeHTML(course.title)}
                </h3>

                <p>
                    ${escapeHTML(course.description)}
                </p>


                <div class="progress-wrap">

                    <div class="progress-top">

                        <span>
                            Progresso
                        </span>

                        <strong>
                            ${progress}%
                        </strong>

                    </div>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${progress}%"
                        ></div>

                    </div>

                </div>


                <div class="course-footer">

                    <span class="badge">
                        ${course.lessons.length} aulas
                    </span>

                    <button
                        class="btn btn-primary"
                        type="button"
                        onclick="openCourse('${course.id}')"
                    >
                        ${progress > 0
                            ? "Continuar"
                            : "Começar"
                        }
                    </button>

                </div>

            </div>

        </article>

    `;

}


function renderCourses() {

    const container =
        document
            .getElementById(
                "coursesGrid"
            );


    const courses =
        getCourses();


    if (!courses.length) {

        container.innerHTML =
            emptyState(
                "Nenhum curso disponível."
            );

        return;

    }


    container.innerHTML =
        courses
            .map(
                createCourseCard
            )
            .join("");

}


function openCourse(
    courseId
) {

    const courses =
        getCourses();


    currentCourse =
        courses.find(
            course =>
                course.id ===
                courseId
        );


    if (!currentCourse) {

        showToast(
            "Curso não encontrado."
        );

        return;

    }


    renderCourseDetail();

    showPage(
        "course-detail"
    );

}


function renderCourseDetail() {

    if (!currentCourse) {
        return;
    }


    const progress =
        getCourseProgress(
            currentCourse
        );


    const container =
        document
            .getElementById(
                "courseDetail"
            );


    container.innerHTML = `

        <div class="detail-hero">

            <span class="eyebrow">
                CURSO
            </span>

            <h1>
                ${escapeHTML(
                    currentCourse.title
                )}
            </h1>

            <p>
                ${escapeHTML(
                    currentCourse.description
                )}
            </p>


            <div
                class="progress-wrap"
                style="max-width:500px;"
            >

                <div class="progress-top">

                    <span>
                        Progresso
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>

            </div>

        </div>


        <div class="section-title-row">

            <div>

                <h2>
                    Aulas
                </h2>

                <p>
                    ${currentCourse.lessons.length}
                    aulas neste curso
                </p>

            </div>

        </div>


        <div class="lessons-list">

            ${
                currentCourse.lessons
                    .map(
                        (
                            lesson,
                            index
                        ) => {

                            const completed =
                                isLessonCompleted(
                                    lesson.id
                                );


                            return `

                                <div
                                    class="lesson-item"
                                    onclick="openLesson('${lesson.id}')"
                                >

                                    <div
                                        class="lesson-number ${
                                            completed
                                                ? "completed"
                                                : ""
                                        }"
                                    >
                                        ${
                                            completed
                                                ? "✓"
                                                : index + 1
                                        }
                                    </div>


                                    <div class="lesson-info">

                                        <strong>
                                            ${escapeHTML(
                                                lesson.title
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                lesson.description ||
                                                "Aula"
                                            )}
                                        </span>

                                    </div>


                                    <span class="badge">
                                        ${
                                            completed
                                                ? "Concluída"
                                                : "Abrir"
                                        }
                                    </span>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}



/* ==================================================
   AULAS
================================================== */

function openLesson(
    lessonId
) {

    if (!currentCourse) {
        return;
    }


    currentLesson =
        currentCourse.lessons.find(
            lesson =>
                lesson.id ===
                lessonId
        );


    if (!currentLesson) {

        showToast(
            "Aula não encontrada."
        );

        return;

    }


    renderLesson();

    showPage(
        "lesson"
    );

}


function renderLesson() {

    if (
        !currentLesson ||
        !currentCourse
    ) {

        return;

    }


    const completed =
        isLessonCompleted(
            currentLesson.id
        );


    const container =
        document
            .getElementById(
                "lessonDetail"
            );


    const videoHTML =
        currentLesson.video
            ?
            `
            <div class="video-placeholder">

                <div>

                    <strong>
                        Vídeo da aula
                    </strong>

                    <p style="margin-top:8px;">
                        ${escapeHTML(
                            currentLesson.video
                        )}
                    </p>

                </div>

            </div>
            `
            :
            `
            <div class="video-placeholder">

                <div>

                    <div style="font-size:45px;">
                        ▶
                    </div>

                    <p style="margin-top:10px;">
                        Esta aula não possui vídeo cadastrado.
                    </p>

                </div>

            </div>
            `;


    container.innerHTML = `

        <article class="lesson-content">

            <span class="eyebrow">
                AULA
            </span>


            <h1>
                ${escapeHTML(
                    currentLesson.title
                )}
            </h1>


            <p
                style="
                    color:var(--muted);
                    margin-top:8px;
                "
            >
                ${escapeHTML(
                    currentLesson.description || ""
                )}
            </p>


            ${videoHTML}


            <div class="lesson-text">

                ${escapeHTML(
                    currentLesson.content || ""
                )
                    .replaceAll(
                        "\n",
                        "<br><br>"
                    )}

            </div>


            <div class="lesson-actions">

                <button
                    class="btn ${
                        completed
                            ? "btn-outline"
                            : "btn-primary"
                    }"
                    type="button"
                    onclick="toggleLessonCompletion('${currentLesson.id}')"
                >

                    ${
                        completed
                            ? "✓ Aula concluída — marcar novamente"
                            : "✓ Marcar aula como concluída"
                    }

                </button>

            </div>

        </article>

    `;


    document
        .getElementById(
            "backToCourse"
        )
        .onclick =
        () => {

            renderCourseDetail();

            showPage(
                "course-detail"
            );

        };

}



/* ==================================================
   SIMULADOS
================================================== */

function createQuizCard(
    quiz
) {

    return `

        <article class="quiz-card">

            <span class="badge">
                ${quiz.questions.length} questões
            </span>


            <h3 style="margin-top:12px;">
                ${escapeHTML(
                    quiz.title
                )}
            </h3>


            <p>
                ${escapeHTML(
                    quiz.description
                )}
            </p>


            <button
                class="btn btn-primary"
                type="button"
                onclick="startQuiz('${quiz.id}')"
            >
                Iniciar simulado
            </button>

        </article>

    `;

}


function renderQuizzes() {

    const container =
        document
            .getElementById(
                "quizList"
            );


    const quizzes =
        getQuizzes();


    container.innerHTML =
        quizzes
            .map(
                createQuizCard
            )
            .join("");

}


function startQuiz(
    quizId
) {

    const quizzes =
        getQuizzes();


    currentQuiz =
        quizzes.find(
            quiz =>
                quiz.id ===
                quizId
        );


    if (!currentQuiz) {
        return;
    }


    currentQuizAnswers =
        {};


    renderQuiz();

    showPage(
        "quiz"
    );

}


function renderQuiz() {

    if (!currentQuiz) {
        return;
    }


    const container =
        document
            .getElementById(
                "quizContainer"
            );


    container.innerHTML = `

        <div class="quiz-header">

            <div>

                <span class="eyebrow">
                    SIMULADO
                </span>

                <h1>
                    ${escapeHTML(
                        currentQuiz.title
                    )}
                </h1>

            </div>

        </div>


        ${
            currentQuiz.questions
                .map(
                    (
                        question,
                        index
                    ) => `

                        <div
                            class="quiz-question-card"
                        >

                            <h2>
                                ${index + 1}.
                                ${escapeHTML(
                                    question.question
                                )}
                            </h2>


                            ${
                                question.options
                                    .map(
                                        (
                                            option,
                                            optionIndex
                                        ) => `

                                            <label
                                                class="quiz-option"
                                            >

                                                <input
                                                    type="radio"
                                                    name="question-${question.id}"
                                                    value="${optionIndex}"
                                                    ${
                                                        currentQuizAnswers[
                                                            question.id
                                                        ] === optionIndex
                                                            ? "checked"
                                                            : ""
                                                    }
                                                    onchange="selectQuizAnswer('${question.id}', ${optionIndex})"
                                                >

                                                ${escapeHTML(
                                                    option
                                                )}

                                            </label>

                                        `
                                    )
                                    .join("")
                            }

                        </div>

                    `
                )
                .join("")
        }


        <button
            class="btn btn-primary"
            type="button"
            onclick="finishQuiz()"
        >
            Finalizar simulado
        </button>

    `;

}


function selectQuizAnswer(
    questionId,
    answer
) {

    currentQuizAnswers[
        questionId
    ] =
        Number(answer);

}


function finishQuiz() {

    if (!currentQuiz) {
        return;
    }


    let correct =
        0;


    currentQuiz.questions.forEach(
        question => {

            if (
                currentQuizAnswers[
                    question.id
                ] ===
                question.answer
            ) {

                correct++;

            }

        }
    );


    const total =
        currentQuiz.questions.length;


    const percentage =
        Math.round(
            (
                correct /
                total
            ) * 100
        );


    const historyKey =
        "estudaplus_quiz_history_" +
        currentUser.id;


    const history =
        JSON.parse(
            localStorage.getItem(
                historyKey
            ) || "[]"
        );


    history.push({

        quizId:
            currentQuiz.id,

        quizTitle:
            currentQuiz.title,

        correct,

        total,

        percentage,

        date:
            new Date()
                .toISOString()

    });


    localStorage.setItem(
        historyKey,
        JSON.stringify(history)
    );


    renderQuizResult(
        correct,
        total,
        percentage
    );


    showPage(
        "quiz-result"
    );

}


function renderQuizResult(
    correct,
    total,
    percentage
) {

    const container =
        document
            .getElementById(
                "quizResult"
            );


    let message;


    if (
        percentage >= 80
    ) {

        message =
            "Excelente desempenho!";

    } else if (
        percentage >= 60
    ) {

        message =
            "Bom trabalho! Continue praticando.";

    } else {

        message =
            "Continue estudando. Você pode melhorar!";

    }


    container.innerHTML = `

        <div class="result-card">

            <span class="eyebrow">
                RESULTADO
            </span>


            <h1
                style="margin-top:8px;"
            >
                ${escapeHTML(
                    currentQuiz.title
                )}
            </h1>


            <div class="result-score">
                ${percentage}%
            </div>


            <h2>
                ${message}
            </h2>


            <p
                style="
                    color:var(--muted);
                    margin-top:10px;
                "
            >
                Você acertou
                <strong>
                    ${correct}
                </strong>
                de
                <strong>
                    ${total}
                </strong>
                questões.
            </p>


            <div
                style="
                    margin-top:25px;
                    display:flex;
                    gap:10px;
                    justify-content:center;
                    flex-wrap:wrap;
                "
            >

                <button
                    class="btn btn-primary"
                    type="button"
                    onclick="showPage('simulados')"
                >
                    Voltar aos simulados
                </button>


                <button
                    class="btn btn-outline"
                    type="button"
                    onclick="showPage('dashboard')"
                >
                    Ir para dashboard
                </button>

            </div>

        </div>

    `;

}



/* ==================================================
   PROGRESSO
================================================== */

function renderProgressPage() {

    const container =
        document
            .getElementById(
                "progressPage"
            );


    const courses =
        getCourses();


    let html =
        "";


    courses.forEach(
        course => {

            const progress =
                getCourseProgress(
                    course
                );


            const completed =
                course.lessons.filter(
                    lesson =>
                        isLessonCompleted(
                            lesson.id
                        )
                ).length;


            html += `

                <div
                    class="course-card"
                    style="margin-bottom:15px;"
                >

                    <div class="course-body">

                        <h3>
                            ${escapeHTML(
                                course.title
                            )}
                        </h3>


                        <p>
                            ${completed}
                            de
                            ${course.lessons.length}
                            aulas concluídas
                        </p>


                        <div class="progress-wrap">

                            <div class="progress-top">

                                <span>
                                    Progresso
                                </span>

                                <strong>
                                    ${progress}%
                                </strong>

                            </div>


                            <div class="progress-bar">

                                <div
                                    class="progress-fill"
                                    style="width:${progress}%"
                                ></div>

                            </div>

                        </div>

                    </div>

                </div>

            `;

        }
    );


    const history =
        JSON.parse(
            localStorage.getItem(
                "estudaplus_quiz_history_" +
                currentUser.id
            ) || "[]"
        );


    html += `

        <div class="section-title-row">

            <div>

                <h2>
                    Histórico de simulados
                </h2>

            </div>

        </div>

    `;


    if (!history.length) {

        html += emptyState(
            "Você ainda não realizou simulados."
        );

    } else {

        html += `

            <div class="lessons-list">

                ${
                    history
                        .slice()
                        .reverse()
                        .map(
                            item => `

                                <div class="lesson-item">

                                    <div class="lesson-number">
                                        ${item.percentage}%
                                    </div>

                                    <div class="lesson-info">

                                        <strong>
                                            ${escapeHTML(
                                                item.quizTitle
                                            )}
                                        </strong>

                                        <span>
                                            ${item.correct}
                                            de
                                            ${item.total}
                                            questões corretas
                                        </span>

                                    </div>

                                </div>

                            `
                        )
                        .join("")
                }

            </div>

        `;

    }


    container.innerHTML =
        html;

}



/* ==================================================
   PERFIL
================================================== */

function saveProfile() {

    const name =
        document
            .getElementById(
                "profileNameInput"
            )
            .value
            .trim();


    const message =
        document
            .getElementById(
                "profileMessage"
            );


    if (
        name.length < 2
    ) {

        message.textContent =
            "Digite um nome válido.";

        return;

    }


    const users =
        getUsers();


    const index =
        users.findIndex(
            user =>
                user.id ===
                currentUser.id
        );


    if (
        index === -1
    ) {
        return;
    }


    users[index].name =
        name;


    currentUser =
        users[index];


    saveUsers(
        users
    );


    updateUserInterface();


    message.textContent =
        "Alterações salvas com sucesso.";


    showToast(
        "Perfil atualizado!"
    );

}



/* ==================================================
   ADMIN
================================================== */

function renderAdmin() {

    if (
        currentUser?.role !==
        "admin"
    ) {
        return;
    }


    renderAdminCourses();

    renderAdminLessons();

    renderAdminQuizzes();

}


function renderAdminCourses() {

    const container =
        document
            .getElementById(
                "adminCoursesList"
            );


    const courses =
        getCourses();


    if (!courses.length) {

        container.innerHTML =
            emptyState(
                "Nenhum curso cadastrado."
            );

        return;

    }


    container.innerHTML =
        courses
            .map(
                course => `

                    <div class="admin-list-item">

                        <div class="admin-item-info">

                            <strong>
                                ${escapeHTML(
                                    course.title
                                )}
                            </strong>

                            <span>
                                ${course.lessons.length}
                                aulas
                            </span>

                        </div>


                        <div class="admin-actions">

                            <button
                                class="btn btn-danger"
                                type="button"
                                onclick="deleteCourse('${course.id}')"
                            >
                                Excluir
                            </button>

                        </div>

                    </div>

                `
            )
            .join("");

}


function renderAdminLessons() {

    const container =
        document
            .getElementById(
                "adminLessonsList"
            );


    const courses =
        getCourses();


    let html =
        "";


    courses.forEach(
        course => {

            course.lessons.forEach(
                lesson => {

                    html += `

                        <div class="admin-list-item">

                            <div class="admin-item-info">

                                <strong>
                                    ${escapeHTML(
                                        lesson.title
                                    )}
                                </strong>

                                <span>
                                    Curso:
                                    ${escapeHTML(
                                        course.title
                                    )}
                                </span>

                            </div>


                            <div class="admin-actions">

                                <button
                                    class="btn btn-danger"
                                    type="button"
                                    onclick="deleteLesson('${course.id}', '${lesson.id}')"
                                >
                                    Excluir
                                </button>

                            </div>

                        </div>

                    `;

                }
            );

        }
    );


    container.innerHTML =
        html ||
        emptyState(
            "Nenhuma aula cadastrada."
        );

}


function renderAdminQuizzes() {

    const container =
        document
            .getElementById(
                "adminQuizzesList"
            );


    const quizzes =
        getQuizzes();


    container.innerHTML =
        quizzes
            .map(
                quiz => `

                    <div class="admin-list-item">

                        <div class="admin-item-info">

                            <strong>
                                ${escapeHTML(
                                    quiz.title
                                )}
                            </strong>

                            <span>
                                ${quiz.questions.length}
                                questões
                            </span>

                        </div>

                    </div>

                `
            )
            .join("");

}


function openNewCourseModal() {

    openModal(`

        <h2>
            Novo curso
        </h2>

        <p
            style="
                color:var(--muted);
                margin-top:5px;
            "
        >
            Cadastre um novo curso.
        </p>


        <div class="form-card"
            style="
                border:0;
                padding:0;
                margin-top:15px;
            "
        >

            <label>
                Nome do curso
            </label>

            <input
                id="newCourseTitle"
                type="text"
                placeholder="Ex.: Inglês básico"
            >


            <label>
                Descrição
            </label>

            <textarea
                id="newCourseDescription"
                placeholder="Descrição do curso"
            ></textarea>


            <button
                class="btn btn-primary"
                type="button"
                onclick="createCourse()"
                style="margin-top:15px;"
            >
                Criar curso
            </button>

        </div>

    `);

}


function createCourse() {

    const title =
        document
            .getElementById(
                "newCourseTitle"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "newCourseDescription"
            )
            .value
            .trim();


    if (!title) {

        showToast(
            "Digite o nome do curso."
        );

        return;

    }


    const courses =
        getCourses();


    courses.push({

        id:
            "curso-" +
            Date.now(),

        title,

        description,

        lessons: []

    });


    saveCourses(
        courses
    );


    closeModal();

    renderAdmin();

    renderCourses();

    showToast(
        "Curso criado com sucesso!"
    );

}


function deleteCourse(
    courseId
) {

    if (
        !confirm(
            "Deseja realmente excluir este curso?"
        )
    ) {
        return;
    }


    let courses =
        getCourses();


    courses =
        courses.filter(
            course =>
                course.id !==
                courseId
        );


    saveCourses(
        courses
    );


    renderAdmin();

    renderCourses();

    showToast(
        "Curso excluído."
    );

}


function deleteLesson(
    courseId,
    lessonId
) {

    if (
        !confirm(
            "Deseja realmente excluir esta aula?"
        )
    ) {
        return;
    }


    const courses =
        getCourses();


    const course =
        courses.find(
            item =>
                item.id ===
                courseId
        );


    if (!course) {
        return;
    }


    course.lessons =
        course.lessons.filter(
            lesson =>
                lesson.id !==
                lessonId
        );


    saveCourses(
        courses
    );


    renderAdmin();

    showToast(
        "Aula excluída."
    );

}



/* ==================================================
   MODAL
================================================== */

function openModal(
    html
) {

    document
        .getElementById(
            "modalContent"
        )
        .innerHTML =
        html;


    document
        .getElementById(
            "modal"
        )
        .classList.remove(
            "hidden"
        );

}


function closeModal() {

    document
        .getElementById(
            "modal"
        )
        .classList.add(
            "hidden"
        );

}


function emptyState(
    message
) {

    return `

        <div
            style="
                background:white;
                border:1px solid var(--border);
                border-radius:15px;
                padding:30px;
                color:var(--muted);
                text-align:center;
                grid-column:1/-1;
            "
        >
            ${escapeHTML(message)}
        </div>

    `;

}



/* ==================================================
   EVENTOS
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* AUTH */

        document
            .getElementById(
                "btnLogin"
            )
            .addEventListener(
                "click",
                login
            );


        document
            .getElementById(
                "btnRegister"
            )
            .addEventListener(
                "click",
                register
            );


        document
            .getElementById(
                "showRegister"
            )
            .addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "loginForm"
                        )
                        .classList.add(
                            "hidden"
                        );


                    document
                        .getElementById(
                            "registerForm"
                        )
                        .classList.remove(
                            "hidden"
                        );

                }
            );


        document
            .getElementById(
                "showLogin"
            )
            .addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "registerForm"
                        )
                        .classList.add(
                            "hidden"
                        );


                    document
                        .getElementById(
                            "loginForm"
                        )
                        .classList.remove(
                            "hidden"
                        );

                }
            );


        /* LOGOUT */

        document
            .getElementById(
                "btnLogout"
            )
            .addEventListener(
                "click",
                logout
            );


        /* NAV */

        document
            .querySelectorAll(
                ".nav-item[data-page]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            showPage(
                                button.dataset.page
                            );

                        }
                    );

                }
            );


        /* BOTÕES DE NAVEGAÇÃO */

        document
            .querySelectorAll(
                "[data-go-page]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        navigateFromButton
                    );

                }
            );


        /* MOBILE */

        document
            .getElementById(
                "mobileMenuButton"
            )
            .addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "sidebar"
                        )
                        .classList.toggle(
                            "open"
                        );

                }
            );


        /* PERFIL */

        document
            .getElementById(
                "saveProfileButton"
            )
            .addEventListener(
                "click",
                saveProfile
            );


        /* MODAL */

        document
            .getElementById(
                "modalClose"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .querySelector(
                ".modal-overlay"
            )
            .addEventListener(
                "click",
                closeModal
            );


        /* ADMIN */

        document
            .getElementById(
                "newCourseButton"
            )
            .addEventListener(
                "click",
                openNewCourseModal
            );


        document
            .querySelectorAll(
                ".admin-tab"
            )
            .forEach(
                tab => {

                    tab.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(
                                    ".admin-tab"
                                )
                                .forEach(
                                    item =>
                                        item.classList.remove(
                                            "active"
                                        )
                                );


                            document
                                .querySelectorAll(
                                    ".admin-panel"
                                )
                                .forEach(
                                    panel =>
                                        panel.classList.remove(
                                            "active"
                                        )
                                );


                            tab.classList.add(
                                "active"
                            );


                            document
                                .getElementById(
                                    "admin-" +
                                    tab.dataset.adminTab
                                )
                                .classList.add(
                                    "active"
                                );

                        }
                    );

                }
            );


        /* INICIALIZAÇÃO */

        initializeAuth();

    }
);