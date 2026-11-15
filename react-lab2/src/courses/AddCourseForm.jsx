import { useState } from "react";

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

export function AddCourseForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await onAdd({
        ...form,
        credits: Number(form.credits),
        capacity: Number(form.capacity),
        description: form.description || null,
      });
      setForm(EMPTY_FORM);
    } catch (error) {
      setFormError(error.message);
      setFieldErrors(error.fieldErrors ?? {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
  );
}
