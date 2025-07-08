export default function Login() {
  return (
    <div style={styles.wrapper}>
      <form style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        <input style={styles.input} type="email" placeholder="Email" /><br /><br />
        <input style={styles.input} type="password" placeholder="Password" /><br /><br />
        <button style={styles.button}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  form: {
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    width: "300px",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "22px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  }
};
