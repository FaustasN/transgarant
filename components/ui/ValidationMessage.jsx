export default function ValidationMessage({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} role="alert" className="font-normal text-red-700">
      {message}
    </span>
  );
}
