// Section 05 — State as a state machine
//
// The whole app's state is ONE object. It only ever changes through
// transition(state, event), which returns a NEW state (or the SAME state
// when the event changes nothing). Never change `state` itself.

export const initialState = Object.freeze({
  status: "idle",       // "idle" | "loading" | "ready" | "error"
  courses: [],          // the courses from the last successful load
  error: null,          // the error message when status is "error"
  departments: [],      // every department name, sorted — filled by the first successful load
  department: "",       // the selected department filter ("" = all)
  query: "",            // the search box text
  planner: [],          // planned courses: { id, code, title, credits }
  grades: {},           // the SGPA calculator form: { [courseId]: "A" | "A-" | … }
});

export function transition(state, event) {
  switch (event.type) {
    case "LOAD_START": {
      if (state.status === "loading" && state.error === null) return state;
      return { ...state, status: "loading", error: null };
    }
    case "LOAD_OK": {
      const courses = event.courses ?? [];
      const nextDepartments = state.departments.length === 0
        ? [...new Set(courses.map((course) => course.department))].sort()
        : state.departments;
      if (state.status === "ready" && state.courses === courses && state.departments === nextDepartments) return state;
      return { ...state, status: "ready", courses, error: null, departments: nextDepartments };
    }
    case "LOAD_FAIL": {
      if (state.status === "error" && state.error === event.message) return state;
      return { ...state, status: "error", error: event.message };
    }
    case "SET_DEPARTMENT": {
      if (state.department === event.department) return state;
      return { ...state, department: event.department };
    }
    case "SET_QUERY": {
      if (state.query === event.query) return state;
      return { ...state, query: event.query };
    }
    case "ADD": {
      const course = event.course;
      if (!course) return state;
      if (state.planner.some((planned) => planned.id === course.id)) return state;
      if (course.seatsLeft === 0) return state;
      const totalCredits = state.planner.reduce((sum, planned) => sum + planned.credits, 0) + course.credits;
      if (totalCredits > 24) return state;
      return { ...state, planner: [...state.planner, { id: course.id, code: course.code, title: course.title, credits: course.credits }] };
    }
    case "REMOVE": {
      const nextPlanner = state.planner.filter((course) => course.id !== event.id);
      if (nextPlanner.length === state.planner.length) return state;
      const nextGrades = { ...state.grades };
      delete nextGrades[event.id];
      return { ...state, planner: nextPlanner, grades: nextGrades };
    }
    case "SET_GRADE": {
      const currentGrade = state.grades[event.id];
      if (currentGrade === event.grade) return state;
      const nextGrades = { ...state.grades };
      if (event.grade === "") {
        delete nextGrades[event.id];
      } else {
        nextGrades[event.id] = event.grade;
      }
      return { ...state, grades: nextGrades };
    }
    default:
      return state; // an event we don't know changes nothing
  }
}
