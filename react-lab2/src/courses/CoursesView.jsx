// Lab day (AI required). This file ends up as the View described in CONTRACT.md §4.
export function CoursesView({ courses, status, error }) {
  switch (status) {
    case "loading":
      return <p>Loading courses…</p>;
    case "error":
      return <p>Couldn't load courses: {error}</p>;
    case "ready":
      if (courses.length === 0) return <p>No courses yet.</p>;
      return (
        <ul className="courses">
          {courses.map((course) => (
            <li key={course.id}>
              <strong>
                {course.code} · {course.title}
              </strong>
              <span>
                {course.credits} credits · {course.department} ·{" "}
                {course.seatsLeft === 0
                  ? "Full"
                  : course.seatsLeft === 1
                    ? "1 seat left"
                    : `${course.seatsLeft} seats left`}
              </span>
            </li>
          ))}
        </ul>
      );
    default:
      throw new Error(`Unknown courses status: ${status}`);
  }
}
