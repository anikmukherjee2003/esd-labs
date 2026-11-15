import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

const EMPTY_FORM = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

const FIELDS = [
  ["code", "Code", "text"],
  ["title", "Title", "text"],
  ["department", "Department", "text"],
  ["credits", "Credits", "number"],
  ["capacity", "Capacity", "number"],
  ["description", "Description", "textarea"],
];

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        const data = await apiFetch("/api/courses");
        if (!ignore) {
          setCourses(data);
          setLoadError(null);
        }
      } catch (error) {
        if (!ignore) setLoadError(error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCourses();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      const created = await apiFetch("/api/courses", {
        method: "POST",
        body: {
          ...form,
          credits: Number(form.credits),
          capacity: Number(form.capacity),
          description: form.description || null,
        },
      });
      setCourses((current) =>
        [...current, created].sort((a, b) => a.code.localeCompare(b.code)),
      );
      setForm(EMPTY_FORM);
    } catch (error) {
      setFormError(error.message);
      setFieldErrors(error.fieldErrors ?? {});
    } finally {
      setSubmitting(false);
    }
  }

  const sortedCourses = [...courses].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <section className="courses-page">
      <h1>Courses</h1>
      {loading ? (
        <p>Loading courses…</p>
      ) : loadError ? (
        <p role="alert">Couldn't load courses: {loadError}</p>
      ) : sortedCourses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul className="courses">
          {sortedCourses.map((course) => (
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
      )}

      <form className="add-course" onSubmit={handleSubmit}>
        <h2>Add a course</h2>
        {FIELDS.map(([name, label, type]) => {
          const error = fieldErrors[name];
          const errorId = `${name}-error`;
          const inputProps = {
            id: name,
            value: form[name],
            "aria-invalid": error ? "true" : undefined,
            "aria-describedby": error ? errorId : undefined,
            onChange: (event) =>
              setForm((current) => ({ ...current, [name]: event.target.value })),
          };

          return (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              {type === "textarea" ? (
                <textarea {...inputProps} />
              ) : (
                <input {...inputProps} type={type} />
              )}
              {error && (
                <p className="field-error" id={errorId}>
                  {error}
                </p>
              )}
            </div>
          );
        })}
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add course"}
        </button>
      </form>
    </section>
  );
}
