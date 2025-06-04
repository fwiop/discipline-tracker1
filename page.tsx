import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const defaultTasks = [
  "بیداری ساعت ۶:۳۰",
  "ورزش ۱۰ دقیقه‌ای",
  "مرور شبانه + ۵ دقیقه سکوت",
  "یک ساعت یادگیری برنامه‌نویسی",
  "مطالعه درس‌های کنکور"
];

export default function DisciplineTracker() {
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState({});
  const [history, setHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("discipline_tracker");
    if (saved) {
      const data = JSON.parse(saved);
      setTasks(data.tasks || defaultTasks);
      setCompleted(data.completed || {});
      setHistory(data.history || []);
    } else {
      setTasks(defaultTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("discipline_tracker", JSON.stringify({ tasks, completed, history }));
  }, [tasks, completed, history]);

  const handleCheck = (task) => {
    setCompleted({ ...completed, [task]: !completed[task] });
  };

  const completeDay = () => {
    const date = new Date().toLocaleDateString();
    const completedCount = tasks.filter(task => completed[task]).length;
    const percentage = (completedCount / tasks.length) * 100;
    setHistory([...history, { date, percentage }]);
    setCompleted({});
  };

  const addTask = (newTask) => {
    if (newTask && !tasks.includes(newTask)) {
      setTasks([...tasks, newTask]);
    }
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index]);
  };

  const saveEdit = () => {
    const newTasks = [...tasks];
    newTasks[editIndex] = editText;
    setTasks(newTasks);
    setEditIndex(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen bg-green-100 p-4 text-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-center">ردیاب دیسیپلین شخصی</h1>

      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">کارهای امروز</h2>
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Checkbox checked={completed[task]} onCheckedChange={() => handleCheck(task)} />
              {editIndex === index ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full"
                  />
                  <Button size="sm" onClick={saveEdit}>✔</Button>
                </>
              ) : (
                <>
                  <span className="flex-grow">{task}</span>
                  <Button size="sm" variant="outline" onClick={() => startEdit(index)}>ویرایش</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTask(index)}>حذف</Button>
                </>
              )}
            </div>
          ))}
          <Button className="mt-2" onClick={completeDay}>ثبت روز</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">افزودن کار جدید</h2>
          <Input
            type="text"
            placeholder="کار جدید..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">نمودار پیشرفت</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
