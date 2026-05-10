import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store, { addTask, deleteTask, fetchTask } from "../store"

const FILTERS = ["All", "Active", "Completed"];

const PRIORITY_CONFIG = {
    high: { label: "High", color: "#c0392b", bg: "#fdf0ef" },
    medium: { label: "Med", color: "#d68910", bg: "#fef9e7" },
    low: { label: "Low", color: "#1a7a4a", bg: "#eafaf1" },
};

const CheckIcon = ({ done }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {done ? (
            <>
                <circle cx="9" cy="9" r="8.5" fill="#2d6a4f" stroke="#2d6a4f" />
                <polyline points="5,9.5 7.5,12 13,6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </>
        ) : (
            <circle cx="9" cy="9" r="8.5" stroke="#c8c8c8" strokeWidth="1" fill="none" />
        )}
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);

export default function Todo() {
    const SAMPLE_TODOS = useSelector((abc) => abc.tasks);
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [priority, setPriority] = useState("medium");
    const [filter, setFilter] = useState("All");
    const [hoveredId, setHoveredId] = useState(null);
    const dispatch = useDispatch();

    const addTodo = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        //setTodos([{ id: Date.now(), text: trimmed, completed: false, priority }, ...todos]);
        store.dispatch(addTask({ id: Date.now(), text: trimmed, completed: false, priority }));
        setInput("");
        console.log(store.getState());
    };

    const toggleTodo = (id) =>
        setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

    const deleteTodo = (id) => {
        setTodos(todos.filter((t) => t.id !== id));
        console.log(store.getState());
        store.dispatch(deleteTask(id));
        console.log(store.getState());
    }

    const clearCompleted = () => setTodos(todos.filter((t) => !t.completed));

    const filtered = todos.filter((t) => {
        if (filter === "Active") return !t.completed;
        if (filter === "Completed") return t.completed;
        return true;
    });

    const fetchAllTask = () => {
        dispatch(fetchTask());
    }

    useEffect(() => {
        setTodos(SAMPLE_TODOS);
    }, [SAMPLE_TODOS])
    const activeCount = todos.filter((t) => !t.completed).length;
    const completedCount = todos.filter((t) => t.completed).length;
    const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;


    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f0e8 0%, #ede8dc 50%, #e8e0d0 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "40px 16px 60px",
            fontFamily: "'Georgia', 'Times New Roman', serif",
        }}>
            <div style={{ width: "100%", maxWidth: "560px" }}>

                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px" }}>
                        <h1 style={{
                            fontSize: "42px",
                            fontWeight: "700",
                            color: "#1a1208",
                            margin: 0,
                            letterSpacing: "-1.5px",
                            fontFamily: "'Georgia', serif",
                        }}>
                            Today
                        </h1>
                        <span style={{
                            fontSize: "14px",
                            color: "#8a7d6a",
                            fontFamily: "'Helvetica Neue', sans-serif",
                            fontWeight: "400",
                            letterSpacing: "0.5px",
                        }}>
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: "14px" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "6px",
                        }}>
                            <span style={{ fontSize: "12px", color: "#8a7d6a", fontFamily: "sans-serif", letterSpacing: "0.3px" }}>
                                {completedCount} of {todos.length} done
                            </span>
                            <span style={{ fontSize: "12px", color: "#2d6a4f", fontFamily: "sans-serif", fontWeight: "600" }}>
                                {progress}%
                            </span>
                        </div>
                        <div style={{
                            height: "4px",
                            background: "#ddd6c8",
                            borderRadius: "99px",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                height: "100%",
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #2d6a4f, #52b788)",
                                borderRadius: "99px",
                                transition: "width 0.5s ease",
                            }} />
                        </div>
                    </div>
                </div>

                {/* Input Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "12px",
                    boxShadow: "0 2px 12px rgba(30,20,5,0.07), 0 0 0 1px rgba(30,20,5,0.04)",
                }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                        <input
                            type="text"
                            placeholder="Add a task..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: "15px",
                                color: "#1a1208",
                                background: "transparent",
                                fontFamily: "'Georgia', serif",
                                caretColor: "#2d6a4f",
                            }}
                        />
                        <button
                            onClick={addTodo}
                            style={{
                                background: "#1a1208",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                padding: "8px 20px",
                                fontSize: "13px",
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontWeight: "500",
                                cursor: "pointer",
                                letterSpacing: "0.3px",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.target.style.background = "#2d6a4f")}
                            onMouseLeave={(e) => (e.target.style.background = "#1a1208")}
                        >
                            Add
                        </button>
                    </div>

                    {/* Priority selector */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#a8998a", fontFamily: "sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>Priority</span>
                        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => setPriority(key)}
                                style={{
                                    padding: "3px 10px",
                                    borderRadius: "99px",
                                    fontSize: "11px",
                                    fontFamily: "sans-serif",
                                    fontWeight: "500",
                                    border: priority === key ? `1.5px solid ${cfg.color}` : "1.5px solid transparent",
                                    background: priority === key ? cfg.bg : "#f4f1ec",
                                    color: priority === key ? cfg.color : "#a8998a",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    letterSpacing: "0.3px",
                                }}
                            >
                                {cfg.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter tabs */}
                <div style={{
                    display: "flex",
                    gap: "4px",
                    background: "#e4ddd1",
                    borderRadius: "12px",
                    padding: "4px",
                    marginBottom: "16px",
                }}>
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                flex: 1,
                                padding: "8px",
                                border: "none",
                                borderRadius: "9px",
                                fontSize: "13px",
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontWeight: filter === f ? "600" : "400",
                                background: filter === f ? "#fff" : "transparent",
                                color: filter === f ? "#1a1208" : "#8a7d6a",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                            }}
                        >
                            {f}
                            {f === "Active" && activeCount > 0 && (
                                <span style={{
                                    marginLeft: "6px",
                                    background: "#1a1208",
                                    color: "#fff",
                                    borderRadius: "99px",
                                    fontSize: "10px",
                                    padding: "1px 6px",
                                    fontWeight: "600",
                                }}>
                                    {activeCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Todo List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {filtered.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "48px 0",
                            color: "#b0a090",
                            fontFamily: "'Georgia', serif",
                            fontSize: "15px",
                            fontStyle: "italic",
                        }}>
                            {filter === "Completed" ? "Nothing completed yet." : "All clear — nothing to do!"}
                        </div>
                    )}

                    {filtered.map((todo) => {
                        const pCfg = PRIORITY_CONFIG[todo.priority];
                        return (
                            <div
                                key={todo.id}
                                onMouseEnter={() => setHoveredId(todo.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    background: hoveredId === todo.id ? "#fff" : "#faf8f4",
                                    borderRadius: "12px",
                                    padding: "14px 16px",
                                    border: "1px solid",
                                    borderColor: hoveredId === todo.id ? "#e0d8cc" : "#ede8dc",
                                    transition: "all 0.15s",
                                    boxShadow: hoveredId === todo.id ? "0 2px 10px rgba(30,20,5,0.06)" : "none",
                                    cursor: "default",
                                }}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
                                >
                                    <CheckIcon done={todo.completed} />
                                </button>

                                {/* Text */}
                                <span style={{
                                    flex: 1,
                                    fontSize: "15px",
                                    color: todo.completed ? "#b0a090" : "#1a1208",
                                    textDecoration: todo.completed ? "line-through" : "none",
                                    fontFamily: "'Georgia', serif",
                                    lineHeight: "1.4",
                                    transition: "color 0.2s",
                                }}>
                                    {todo.text}
                                </span>

                                {/* Priority badge */}
                                <span style={{
                                    fontSize: "10px",
                                    fontFamily: "sans-serif",
                                    fontWeight: "600",
                                    letterSpacing: "0.4px",
                                    textTransform: "uppercase",
                                    color: pCfg.color,
                                    background: pCfg.bg,
                                    padding: "3px 8px",
                                    borderRadius: "99px",
                                    flexShrink: 0,
                                    opacity: todo.completed ? 0.5 : 1,
                                }}>
                                    {pCfg.label}
                                </span>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#c8c0b4",
                                        padding: "2px",
                                        display: "flex",
                                        opacity: hoveredId === todo.id ? 1 : 0,
                                        transition: "opacity 0.15s, color 0.15s",
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#c8c0b4")}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                {completedCount > 0 && (
                    <>
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <button
                                onClick={clearCompleted}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "12px",
                                    color: "#b0a090",
                                    fontFamily: "sans-serif",
                                    cursor: "pointer",
                                    letterSpacing: "0.3px",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "#c0392b")}
                                onMouseLeave={(e) => (e.target.style.color = "#b0a090")}
                            >
                                Clear {completedCount} completed
                            </button>
                            <button
                                onClick={fetchAllTask}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "12px",
                                    color: "#b0a090",
                                    fontFamily: "sans-serif",
                                    cursor: "pointer",
                                    letterSpacing: "0.3px",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "#2bc087")}
                                onMouseLeave={(e) => (e.target.style.color = "#b0a090")}
                            >
                                Fetch Tasks
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
