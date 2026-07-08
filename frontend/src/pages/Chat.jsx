import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { motion } from "framer-motion";

function Chat() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState("");
  const messagesEndRef = useRef(null);

  // Active Tab State (group or ai)
  const [activeTab, setActiveTab] = useState("group"); // group, ai

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChat, setAiChat] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    if (!groupId || groupId === "lobby") {
      setMessages([]);
      setRoomName("");
      return;
    }

    fetchMessages();

    socket.emit("join-group", groupId);

    socket.on("receive-message", (message) => {
      if (message.group === groupId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const userRes = await axios.get("/api/groups", {
        headers: { Authorization: token },
      });
      setUserGroups(userRes.data);

      const allRes = await axios.get("/api/groups/all", {
        headers: { Authorization: token },
      });
      setAllGroups(allRes.data);

      if (groupId && groupId !== "lobby") {
        const currentGroup = allRes.data.find((g) => g._id === groupId);
        if (currentGroup) {
          setRoomName(currentGroup.name);
        }
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/messages/${groupId}`,
        {
          headers: { Authorization: token },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/messages",
        {
          groupId,
          text,
        },
        {
          headers: { Authorization: token },
        }
      );

      socket.emit("send-message", {
        ...res.data,
        groupId,
      });

      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const groupResponse = await axios.post(
        "/api/groups",
        { name: newRoomName },
        { headers: { Authorization: token } }
      );
      setNewRoomName("");
      const newGroupId = groupResponse.data._id;
      
      await axios.put(
        `/api/groups/join/${newGroupId}`,
        {},
        { headers: { Authorization: token } }
      );

      fetchRooms();
      navigate(`/chat/${newGroupId}`);
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const handleJoinGroup = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/groups/join/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchRooms();
      navigate(`/chat/${id}`);
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  const handleAiPromptSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMessage = { role: "user", text: aiPrompt };
    setAiChat((prev) => [...prev, userMessage]);
    setAiPrompt("");
    setAiLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/planner/explain",
        { topic: aiPrompt },
        { headers: { Authorization: token } }
      );
      
      const assistantMessage = { role: "assistant", text: res.data.text };
      setAiChat((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setAiChat((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I had trouble processing that request." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const loadSuggestion = (suggestion) => {
    setAiPrompt(suggestion);
  };

  if (loading) {
    return <Loader variant="spinner" className="h-96" />;
  }

  return (
    <div className="space-y-6 text-left h-[calc(100vh-140px)] flex flex-col">
      {/* Tab Selector */}
      <div className="flex gap-4 border-b border-gray-800 pb-2 select-none">
        <button
          onClick={() => setActiveTab("group")}
          className={`pb-2 px-1 font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === "group"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          💬 Study Rooms
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-2 px-1 font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === "ai"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          ✨ Gemini AI Assistant
        </button>
      </div>

      {activeTab === "group" ? (
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
          {/* Sidebar */}
          <div className="w-full md:w-72 glass-panel border-gray-800/80 rounded-[24px] p-4 flex flex-col justify-between h-full overflow-y-auto">
            <div className="space-y-6">
              {/* Create Group Form */}
              <form onSubmit={handleCreateGroup} className="space-y-2">
                <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                  Create Room
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New room name..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                    className="flex-1 border border-gray-800 p-2 text-xs rounded-xl bg-gray-950 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Button type="submit" size="sm" className="px-3">
                    +
                  </Button>
                </div>
              </form>

              {/* User Joined Rooms */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                  Joined Rooms
                </h4>
                <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                  {userGroups.length === 0 ? (
                    <p className="text-xs text-gray-600">No groups joined yet.</p>
                  ) : (
                    userGroups.map((g) => (
                      <button
                        key={g._id}
                        onClick={() => navigate(`/chat/${g._id}`)}
                        className={`w-full text-left font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          groupId === g._id
                            ? "bg-purple-500/15 border border-purple-500/30 text-purple-300"
                            : "hover:bg-gray-850/50 text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        # {g.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Explore Rooms */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                  Explore Public Rooms
                </h4>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {allGroups.filter((g) => !userGroups.some((ug) => ug._id === g._id))
                    .length === 0 ? (
                    <p className="text-xs text-gray-600">No public groups.</p>
                  ) : (
                    allGroups
                      .filter((g) => !userGroups.some((ug) => ug._id === g._id))
                      .map((g) => (
                        <div
                          key={g._id}
                          className="flex justify-between items-center bg-gray-950/60 p-2 rounded-xl border border-gray-800/80"
                        >
                          <span className="text-xs font-semibold text-gray-300 truncate max-w-[110px]">
                            # {g.name}
                          </span>
                          <button
                            onClick={() => handleJoinGroup(g._id)}
                            className="bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Join
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Panel */}
          <div className="flex-1 glass-panel border-gray-800/80 rounded-[24px] flex flex-col justify-between h-full overflow-hidden">
            {groupId && groupId !== "lobby" ? (
              <>
                {/* Header */}
                <div className="p-4 bg-gray-950/40 border-b border-gray-800/60 flex items-center">
                  <span className="text-2xl text-purple-500 mr-2 select-none font-black">#</span>
                  <h3 className="text-xl font-black text-white truncate m-0">
                    {roomName || "Study Group"}
                  </h3>
                </div>

                {/* Messages list */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <EmptyState
                      icon="💬"
                      title="No chat history"
                      description="Send a message to start conversing with your study partners!"
                      className="border-none bg-transparent"
                    />
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg._id || index}
                        className="flex flex-col"
                      >
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-extrabold text-sm text-gray-200">
                            {msg.sender?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                        <p className="text-sm bg-gray-900 border border-gray-800 p-2.5 rounded-2xl rounded-tl-none leading-relaxed text-gray-300 inline-block self-start max-w-[85%] break-words">
                          {msg.text}
                        </p>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send form */}
                <form
                  onSubmit={sendMessage}
                  className="p-4 bg-gray-950/40 border-t border-gray-800/60 flex gap-3"
                >
                  <input
                    className="flex-1 border border-gray-800 p-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 bg-gray-950 text-gray-200"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Message #${roomName}...`}
                    required
                  />
                  <Button type="submit">Send</Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 text-3xl mb-4 font-black select-none">
                  #
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Select or Create a Study Room
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6">
                  Select a room in the sidebar or match with peers to start collaborating.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Gemini AI Assistant */
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
          {/* AI Prompts list */}
          <div className="w-full md:w-72 glass-panel border-gray-800/80 rounded-[24px] p-4 space-y-4 h-full overflow-y-auto select-none">
            <h4 className="text-xs uppercase font-black text-gray-500 tracking-wider">
              Quick Suggestions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => loadSuggestion("Explain React Hooks (useEffect, useState).")}
                className="w-full text-left p-3 rounded-xl border border-gray-850 hover:border-purple-500/30 text-xs font-bold text-gray-400 hover:text-gray-200 transition-all cursor-pointer bg-gray-900/40"
              >
                Explain React Hooks
              </button>
              <button
                onClick={() => loadSuggestion("Generate 5 DSA interview questions on Arrays & HashMaps.")}
                className="w-full text-left p-3 rounded-xl border border-gray-850 hover:border-purple-500/30 text-xs font-bold text-gray-400 hover:text-gray-200 transition-all cursor-pointer bg-gray-900/40"
              >
                Generate 5 DSA Questions
              </button>
              <button
                onClick={() => loadSuggestion("Create a study timeline for learning MongoDB in 3 days.")}
                className="w-full text-left p-3 rounded-xl border border-gray-850 hover:border-purple-500/30 text-xs font-bold text-gray-400 hover:text-gray-200 transition-all cursor-pointer bg-gray-900/40"
              >
                MongoDB Study Timeline
              </button>
            </div>
          </div>

          {/* AI Conversation Container */}
          <div className="flex-1 glass-panel border-gray-800/80 rounded-[24px] flex flex-col justify-between h-full overflow-hidden">
            <div className="p-4 bg-gray-950/40 border-b border-gray-800/60 flex items-center">
              <span className="text-xl mr-2 select-none">✨</span>
              <h3 className="text-xl font-black text-white m-0">
                Gemini AI Chat Assistant
              </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiChat.length === 0 ? (
                <EmptyState
                  icon="✨"
                  title="Ask Gemini Anything"
                  description="Ask technical questions, request explanations, or generate DSA challenges."
                  className="border-none bg-transparent"
                />
              ) : (
                aiChat.map((msg, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <span
                      className={`text-[10px] uppercase font-black tracking-wider ${
                        msg.role === "user" ? "text-indigo-400" : "text-purple-400"
                      }`}
                    >
                      {msg.role === "user" ? "You" : "Gemini AI"}
                    </span>
                    <p
                      className={`text-sm p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 self-start max-w-[85%]"
                          : "bg-purple-500/10 text-purple-200 border border-purple-500/20 self-start max-w-[95%]"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider animate-pulse">
                    Gemini is thinking...
                  </span>
                  <div className="bg-purple-500/10 p-4 border border-dashed border-purple-500/20 rounded-2xl w-2/3">
                    <Loader variant="text" count={2} />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleAiPromptSubmit}
              className="p-4 bg-gray-950/40 border-t border-gray-800/60 flex gap-3"
            >
              <input
                className="flex-1 border border-gray-800 p-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 bg-gray-950 text-gray-250"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask Gemini (e.g. Explain binary trees...)"
                required
                disabled={aiLoading}
              />
              <Button type="submit" loading={aiLoading}>
                Ask AI
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;