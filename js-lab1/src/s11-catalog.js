// Section 11 — The array toolkit for UIs
import { toCardView } from "./s04-functions.js";
import { byField } from "./s05-higher-order.js";

// Courses in one department. Case-insensitive.
export function byDepartment(courses, department) {
  const target = department.toLowerCase();
  return courses.filter((course) => course.department.toLowerCase() === target);
}

// Courses that still have seats.
export function openOnly(courses) {
  return courses.filter((course) => course.seatsLeft > 0);
}

// Case-insensitive match on code OR title. A blank query returns everything.
export function searchCourses(courses, query) {
  const target = query.trim().toLowerCase();
  if (!target) return [...courses];
  return courses.filter((course) =>
    course.code.toLowerCase().includes(target) || course.title.toLowerCase().includes(target),
  );
}

// The course with this code (case-insensitive), or undefined.
export function findByCode(courses, code) {
  const target = code.toLowerCase();
  return courses.find((course) => course.code.toLowerCase() === target);
}

// Sum of credits.
export function totalCredits(courses) {
  return courses.reduce((total, course) => total + course.credits, 0);
}

// { "Computer Science": 5, "Electronics": 4, ... }
export function countByDepartment(courses) {
  return courses.reduce((counts, course) => {
    counts[course.department] = (counts[course.department] ?? 0) + 1;
    return counts;
  }, {});
}

// Unique department names, sorted A→Z.
export function departments(courses) {
  return [...new Set(courses.map((course) => course.department))].sort();
}

// A sorted COPY. The input must not change. Reuse byField from section 05.
export function sortedBy(courses, field) {
  return [...courses].sort(byField(field));
}

// Is at least one course full?
export function anyFull(courses) {
  return courses.some((course) => course.seatsLeft === 0);
}

// Does every course have at least `n` seats?
export function allHaveSeats(courses, n = 1) {
  return courses.every((course) => course.seatsLeft >= n);
}

// The cards a department page shows: that department, open courses only,
// sorted by code, turned into card views. One chain.
export function courseCards(courses, department) {
  return byDepartment(courses, department)
    .filter((course) => course.seatsLeft > 0)
    .sort(byField("code"))
    .map(toCardView);
}

// Planner ids → the course objects, in planner order. Unknown ids are skipped.
export function plannerCourses(planner, courses) {
  return planner
    .map((id) => courses.find((course) => course.id === id))
    .filter((course) => course !== undefined);
}

// Total credits of the planned courses.
export function plannerCredits(planner, courses) {
  return plannerCourses(planner, courses).reduce((total, course) => total + course.credits, 0);
}

// Can this course be added? It must exist, have a seat, not already be in
// the planner, and keep the total within the limit (24 by default).
export function canAdd(planner, courses, courseId, limit = 24) {
  const course = courses.find((item) => item.id === courseId);
  if (!course || course.seatsLeft <= 0 || planner.includes(courseId)) return false;
  return plannerCredits(planner, courses) + course.credits <= limit;
}
