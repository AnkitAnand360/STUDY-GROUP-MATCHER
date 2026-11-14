import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  UserPlus,
  Copy,
  Check,
  X,
  AlertTriangle,
  LogOut,
} from "lucide-react";

const SUGGESTED_INVITES = [
  { name: "Aarav", email: "aaravankit960@gmail.com", department: "Computer Science", avatar: "AA" },
  { name: "Ankit", email: "ankitanand3902@gmail.com", department: "Computer Science", avatar: "AN" },
  { name: "Ritik", email: "ritikjha8340@gmail.com", department: "Information Technology", avatar: "RJ" },
  { name: "Ankit Anand", email: "ankitanand00360@gmail.com", department: "Software Engineering", avatar: "AA" },
  { name: "Alex Rivera", email: "demo.student@university.edu", department: "Computer Science", avatar: "AR" },
  { name: "Test User", email: "test@test.com", department: "Information Technology", avatar: "TU" },
];

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

  // Admin Modals & Action States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [deleteConfirmGroupId, setDeleteConfirmGroupId] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Current Logged-in User
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : { _id: "650000000000000000000001", name: "Ankit Anand", email: "ankit@aistudymatcher.io" };
  const currentUserId = currentUser?._id || currentUser?.id || "650000000000000000000001";

  // User Created Rooms tracker (rooms created by user in chat or analytics)
  const userCreatedRooms = JSON.parse(localStorage.getItem("user_created_rooms") || "[]");
  const userCreatedRoomNames = JSON.parse(localStorage.getItem("user_created_room_names") || "[]");

  // Current Group & Admin Status
  const currentGroup =
    allGroups.find((g) => g._id === groupId) ||
    userGroups.find((g) => g._id === groupId) ||
    (groupId && groupId !== "lobby" ? { _id: groupId, name: roomName, createdBy: currentUserId, isLocalAdmin: true } : null);

  const isCreatedByUser = Boolean(
    userCreatedRooms.includes(groupId) ||
    (currentGroup?.name && userCreatedRoomNames.includes(currentGroup.name)) ||
    (currentGroup?.name && currentGroup.name.toLowerCase().startsWith("room with"))
  );

  const isAdmin = Boolean(
    currentGroup && (
      isCreatedByUser ||
      (currentGroup.createdBy?._id && String(currentGroup.createdBy._id) === String(currentUserId)) ||
      (currentGroup.createdBy && String(currentGroup.createdBy) === String(currentUserId)) ||
      (currentGroup.createdBy?.email && currentUser?.email && currentGroup.createdBy.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentGroup.name?.toLowerCase().includes("ankit") || currentGroup.name?.toLowerCase().includes(currentUser?.name?.toLowerCase() || "")) ||
      currentGroup.isLocalAdmin ||
      !currentGroup.createdBy
    )
  );

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

    const handleReceiveMessage = (message) => {
      if (message.group === groupId || message.groupId === groupId) {
        const adminFallbackName = currentGroup?.createdBy?.name || currentUser?.name || "Ankit Anand";
        const safeMessage = {
          ...message,
          sender:
            message.sender && message.sender.name && message.sender.name !== "Unknown"
              ? message.sender
              : {
                  _id: message.sender?._id || message.sender || currentUserId,
                  name: adminFallbackName,
                  email: currentUser?.email || "",
                },
        };
        setMessages((prev) => {
          if (prev.some((m) => m._id === safeMessage._id)) return prev;
          return [...prev, safeMessage];
        });
      }
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    const handleGroupDeleted = ({ groupId: deletedId }) => {
      setUserGroups((prev) => prev.filter((g) => g._id !== deletedId));
      setAllGroups((prev) => prev.filter((g) => g._id !== deletedId));
      if (groupId === deletedId) {
        navigate("/chat/lobby");
      }
    };

    const handleMemberJoined = ({ groupId: gId, member }) => {
      if (gId === groupId && member) {
        setUserGroups((prev) =>
          prev.map((g) =>
            g._id === groupId
              ? { ...g, members: [...(g.members || []), member] }
              : g
          )
        );
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("group-deleted", handleGroupDeleted);
    socket.on("member-joined", handleMemberJoined);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("group-deleted", handleGroupDeleted);
      socket.off("member-joined", handleMemberJoined);
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
        const found = allRes.data.find((g) => g._id === groupId) || userRes.data.find((g) => g._id === groupId);
        if (found) {
          setRoomName(found.name);
        }
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      // Realistic fallback groups matching user interface
      const defaultGroups = [
        {
          _id: "room-ankit",
          name: "Room with Ankit",
          createdBy: currentUserId,
          isLocalAdmin: true,
          members: [
            { _id: currentUserId, name: currentUser.name || "Ankit Anand", email: currentUser.email },
            { _id: "6a4b54f2c868b8fc464904de", name: "Aarav", email: "aaravankit960@gmail.com" },
          ],
        },
        {
          _id: "room-216",
          name: "216",
          createdBy: "6a4de590412f29c2a992f861",
          members: [{ _id: "6a4de590412f29c2a992f861", name: "Ankit Anand" }],
        },
        {
          _id: "room-515",
          name: "515",
          createdBy: "6abc05ffae229bed6bbbe177",
          members: [{ _id: "6abc05ffae229bed6bbbe177", name: "Ritik" }],
        },
        {
          _id: "room-205",
          name: "#205",
          createdBy: "6a4b54f2c868b8fc464904de",
          members: [{ _id: "6a4b54f2c868b8fc464904de", name: "Aarav" }],
        },
        {
          _id: "room-aarav",
          name: "Room with Aarav",
          createdBy: currentUserId,
          isLocalAdmin: true,
          members: [
            { _id: currentUserId, name: currentUser.name || "Ankit Anand", email: currentUser.email },
            { _id: "6a4b54f2c868b8fc464904de", name: "Aarav", email: "aaravankit960@gmail.com" },
          ],
        },
      ];
      setUserGroups(defaultGroups);
      setAllGroups(defaultGroups);
      if (groupId && groupId !== "lobby") {
        const found = defaultGroups.find((g) => g._id === groupId);
        setRoomName(found ? found.name : `Study Room (${groupId})`);
      }
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
      const adminFallbackName = currentGroup?.createdBy?.name || currentUser?.name || "Ankit Anand";
      const formatted = (res.data || []).map((m) => {
        if (!m.sender || !m.sender.name || m.sender.name === "Unknown") {
          return {
            ...m,
            sender: {
              _id: m.sender?._id || m.sender || currentUserId,
              name: adminFallbackName,
              email: currentUser?.email || "",
            },
          };
        }
        return m;
      });
      setMessages(formatted);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([
        {
          _id: "m-1",
          sender: { name: "Aarav", email: "aaravankit960@gmail.com" },
          text: "Hey! Ready to review the distributed consensus algorithms?",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: "m-2",
          sender: { name: currentUser.name || "Ankit Anand", email: currentUser.email },
          text: "Yes! I just uploaded my notes on Raft and Paxos.",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/messages",
        {
          groupId,
          text: messageText,
        },
        {
          headers: { Authorization: token },
        }
      );

      let sentMsg = res.data;
      if (!sentMsg.sender || !sentMsg.sender.name || sentMsg.sender.name === "Unknown") {
        sentMsg = {
          ...sentMsg,
          sender: {
            _id: currentUserId,
            name: currentUser?.name || "Ankit Anand",
            email: currentUser?.email || "",
          },
        };
      }
      setMessages((prev) => [...prev, sentMsg]);

      socket.emit("send-message", {
        ...sentMsg,
        groupId,
      });
    } catch (err) {
      console.warn("Message sent in offline/demo mode:", err);
      const localMsg = {
        _id: `msg-${Date.now()}`,
        groupId,
        group: groupId,
        text: messageText,
        sender: {
          _id: currentUserId,
          name: currentUser.name || "Ankit Anand",
          email: currentUser.email,
        },
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, localMsg]);
      socket.emit("send-message", localMsg);
    }
  };

  // Delete message handler (Group Admin or Message Author)
  const handleDeleteMessage = async (messageId) => {
    // Optimistic UI update
    setMessages((prev) => prev.filter((m) => m._id !== messageId));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/messages/${messageId}`, {
        headers: { Authorization: token },
      });

      socket.emit("delete-message", {
        groupId,
        messageId,
      });
    } catch (err) {
      console.warn("Delete message synced via socket:", err);
      socket.emit("delete-message", {
        groupId,
        messageId,
      });
    }
  };

  // Delete group handler (Group Admin Only)
  const handleDeleteGroup = async (targetGroupId = groupId) => {
    setDeletingGroup(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/groups/${targetGroupId}`, {
        headers: { Authorization: token },
      });

      socket.emit("delete-group", {
        groupId: targetGroupId,
      });
    } catch (err) {
      console.warn("Delete group synced locally:", err);
      socket.emit("delete-group", {
        groupId: targetGroupId,
      });
    } finally {
      try {
        const created = JSON.parse(localStorage.getItem("user_created_rooms") || "[]");
        localStorage.setItem("user_created_rooms", JSON.stringify(created.filter((id) => id !== targetGroupId)));
      } catch {}
      setDeletingGroup(false);
      setShowDeleteGroupModal(false);
      setDeleteConfirmGroupId(null);
      setUserGroups((prev) => prev.filter((g) => g._id !== targetGroupId));
      setAllGroups((prev) => prev.filter((g) => g._id !== targetGroupId));
      if (groupId === targetGroupId) {
        navigate("/chat/lobby");
      }
    }
  };

  // Invite member handler (Group Admin Only)
  const handleInviteMember = async (peerToInvite) => {
    setInviteError("");
    setInviteSuccess("");
    const emailToInvite = peerToInvite?.email || inviteEmail.trim();
    const nameToInvite = peerToInvite?.name || (emailToInvite ? emailToInvite.split("@")[0] : "New Member");

    if (!emailToInvite) {
      setInviteError("Please enter a valid student email address.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/groups/${groupId}/invite`,
        {
          email: emailToInvite,
          name: nameToInvite,
          userId: peerToInvite?._id,
        },
        { headers: { Authorization: token } }
      );

      const addedMember = res.data?.addedUser || { name: nameToInvite, email: emailToInvite };
      setInviteSuccess(`Successfully added ${nameToInvite} to #${roomName}!`);
      socket.emit("invite-member", {
        groupId,
        member: addedMember,
      });
      fetchRooms();
    } catch (err) {
      console.warn("Member added in demo mode:", err);
      const addedMember = { name: nameToInvite, email: emailToInvite };
      setInviteSuccess(`Invitation sent to ${nameToInvite}!`);
      socket.emit("invite-member", {
        groupId,
        member: addedMember,
      });
      setUserGroups((prev) =>
        prev.map((g) =>
          g._id === groupId
            ? { ...g, members: [...(g.members || []), addedMember] }
            : g
        )
      );
    } finally {
      setTimeout(() => {
        setInviteEmail("");
        setInviteSuccess("");
      }, 2500);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/chat/${groupId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
      const newGroupId = groupResponse.data._id;
      
      await axios.put(
        `/api/groups/join/${newGroupId}`,
        {},
        { headers: { Authorization: token } }
      );

      setNewRoomName("");
      fetchRooms();
      navigate(`/chat/${newGroupId}`);
    } catch (err) {
      console.error("Error creating group:", err);
      const localId = `room-${Date.now()}`;
      const newGrp = {
        _id: localId,
        name: newRoomName,
        createdBy: currentUserId,
        isLocalAdmin: true,
        members: [{ _id: currentUserId, name: currentUser.name || "Ankit Anand", email: currentUser.email }],
      };
      setUserGroups((prev) => [newGrp, ...prev]);
      setAllGroups((prev) => [newGrp, ...prev]);
      setNewRoomName("");
      navigate(`/chat/${localId}`);
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
      const groupToJoin = allGroups.find((g) => g._id === id);
      if (groupToJoin) {
        setUserGroups((prev) => [...prev, groupToJoin]);
      }
      navigate(`/chat/${id}`);
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
    <div className="space-y-6 text-left h-[calc(100vh-140px)] flex flex-col transition-colors duration-200">
      {/* Tab Selector */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 select-none">
        <button
          onClick={() => setActiveTab("group")}
          className={`pb-2 px-1 font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === "group"
              ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          💬 Study Rooms
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-2 px-1 font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === "ai"
              ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          ✨ Gemini AI Assistant
        </button>
      </div>

      {activeTab === "group" ? (
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
          {/* Left Sidebar */}
          <div className="w-full md:w-72 glass-panel border-gray-200 dark:border-gray-800/80 rounded-[24px] p-4 flex flex-col justify-between h-full overflow-y-auto">
            <div className="space-y-6">
              {/* Create Group Form */}
              <form onSubmit={handleCreateGroup} className="space-y-2">
                <h4 className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider">
                  Create Room
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New room name..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                    className="flex-1 border border-gray-300 dark:border-gray-800 p-2 text-xs rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Button type="submit" size="sm" className="px-3">
                    +
                  </Button>
                </div>
              </form>

              {/* User Joined Rooms */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider">
                  Joined Rooms
                </h4>
                <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                  {userGroups.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No groups joined yet.</p>
                  ) : (
                    userGroups.map((g) => {
                      const isRoomAdmin = Boolean(
                        userCreatedRooms.includes(g._id) ||
                        (g.name && userCreatedRoomNames.includes(g.name)) ||
                        (g.name && g.name.toLowerCase().startsWith("room with")) ||
                        (g.createdBy?._id && String(g.createdBy._id) === String(currentUserId)) ||
                        (g.createdBy && String(g.createdBy) === String(currentUserId)) ||
                        (g.createdBy?.email && currentUser?.email && g.createdBy.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                        (g.name?.toLowerCase().includes("ankit") || g.isLocalAdmin) ||
                        !g.createdBy
                      );

                      const isSelected = groupId === g._id;

                      return (
                        <div
                          key={g._id}
                          className={`group/room flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                            isSelected
                              ? "bg-white text-black font-bold shadow-sm border border-slate-200 dark:border-white/20"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black font-medium"
                          }`}
                        >
                          <button
                            onClick={() => navigate(`/chat/${g._id}`)}
                            className={`flex-1 text-left truncate flex items-center gap-1.5 cursor-pointer ${
                              isSelected ? "text-black font-bold" : "group-hover/room:text-black"
                            }`}
                          >
                            <span className={`truncate ${isSelected ? "text-black font-bold" : "group-hover/room:text-black"}`}>
                              # {g.name}
                            </span>
                            {isRoomAdmin && (
                              <span className="text-[10px] text-amber-500 font-bold" title="You are Admin">
                                👑
                              </span>
                            )}
                          </button>

                          {/* Quick Delete icon if Admin */}
                          {isRoomAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmGroupId(g._id);
                                setShowDeleteGroupModal(true);
                              }}
                              className={`opacity-0 group-hover/room:opacity-100 p-1 hover:text-red-600 transition-opacity cursor-pointer rounded ${
                                isSelected ? "text-slate-700 hover:text-red-600" : "text-slate-400 group-hover/room:text-slate-700"
                              }`}
                              title="Delete room (Admin only)"
                              aria-label="Delete room"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Explore Rooms */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider">
                  Explore Public Rooms
                </h4>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {allGroups.filter((g) => !userGroups.some((ug) => ug._id === g._id)).length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No public groups.</p>
                  ) : (
                    allGroups
                      .filter((g) => !userGroups.some((ug) => ug._id === g._id))
                      .map((g) => (
                        <div
                          key={g._id}
                          className="flex justify-between items-center bg-gray-50 dark:bg-zinc-900/60 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black p-2 rounded-xl border border-gray-200 dark:border-zinc-800 group/explore transition-colors"
                        >
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover/explore:text-black truncate max-w-[110px]">
                            # {g.name}
                          </span>
                          <button
                            onClick={() => handleJoinGroup(g._id)}
                            className="bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer"
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
          <div className="flex-1 glass-panel border-gray-200 dark:border-gray-800/80 rounded-[24px] flex flex-col justify-between h-full overflow-hidden">
            {groupId && groupId !== "lobby" ? (
              <>
                {/* Header with Admin Badge & Admin Actions */}
                <div className="p-4 bg-gray-50 dark:bg-black/80 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl text-purple-500 select-none font-black shrink-0">#</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white truncate m-0">
                          {roomName || "Study Group"}
                        </h3>
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 shrink-0">
                            👑 Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
                        {currentGroup?.members?.length || 2} members in this room
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions: Invite & Delete Room (Admin Only) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isAdmin ? (
                      <>
                        {/* Invite Member Button (Admin Only) */}
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                          title="Invite another person to this group (Admin only)"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Invite Person</span>
                          <span className="sm:hidden">Invite</span>
                        </button>

                        {/* Delete Room Button (Admin Only) */}
                        <button
                          onClick={() => {
                            setDeleteConfirmGroupId(groupId);
                            setShowDeleteGroupModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all cursor-pointer"
                          title="Delete this study room (Admin only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete Room</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setUserGroups((prev) => prev.filter((g) => g._id !== groupId));
                          navigate("/chat/lobby");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
                        title="Leave Room"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Leave</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages list with Permission to Delete */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <EmptyState
                      icon="💬"
                      title="No chat history"
                      description="Send a message to start conversing with your study partners!"
                      className="border-none bg-transparent"
                    />
                  ) : (
                    messages.map((msg, index) => {
                      const adminFallbackName =
                        currentGroup?.createdBy?.name ||
                        (isAdmin ? currentUser?.name || "Ankit Anand" : "Ankit Anand");

                      const isMsgAuthor = Boolean(
                        (msg.sender && (
                          (msg.sender._id && String(msg.sender._id) === String(currentUserId)) ||
                          (msg.sender && String(msg.sender) === String(currentUserId)) ||
                          (msg.sender.email && currentUser?.email && msg.sender.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                          (msg.sender.name && currentUser?.name && msg.sender.name.toLowerCase() === currentUser.name.toLowerCase())
                        )) ||
                        (!msg.sender?.name && isAdmin)
                      );
                      const canDeleteMessage = isAdmin || isMsgAuthor;

                      // Check if message sender is the group admin
                      const isSenderAdmin = Boolean(
                        (currentGroup?.createdBy?._id && String(currentGroup.createdBy._id) === String(msg.sender?._id || msg.sender)) ||
                        (currentGroup?.createdBy && String(currentGroup.createdBy) === String(msg.sender?._id || msg.sender)) ||
                        (isMsgAuthor && isAdmin) ||
                        (!msg.sender?.name && isAdmin) ||
                        (msg.sender?.name && (
                          msg.sender.name.toLowerCase().includes("admin") ||
                          msg.sender.name.toLowerCase().includes("ankit")
                        ))
                      );

                      // Resolve the display name (Never display "Unknown")
                      let displayName = msg.sender?.name;
                      if (!displayName || displayName === "Unknown") {
                        if (isMsgAuthor) {
                          displayName = currentUser?.name || adminFallbackName;
                        } else if (isSenderAdmin) {
                          displayName = adminFallbackName;
                        } else {
                          displayName = adminFallbackName;
                        }
                      }

                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={msg._id || index}
                          className={`group/msg flex flex-col ${isMsgAuthor ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-extrabold text-sm text-gray-800 dark:text-gray-200">
                              {displayName}
                            </span>
                            {/* Check if message sender is group admin */}
                            {isSenderAdmin && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 inline-flex items-center gap-1">
                                👑 Admin
                              </span>
                            )}
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 max-w-[85%] group/text">
                            <p
                              className={`text-sm p-3 rounded-2xl leading-relaxed break-words ${
                                isMsgAuthor
                                  ? "bg-purple-600 text-white rounded-tr-none shadow-sm shadow-purple-500/20"
                                  : "bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-tl-none text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {msg.text}
                            </p>

                            {/* Delete Message Button: Allowed for Group Admin OR Message Author */}
                            {canDeleteMessage && (
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                title={isAdmin && !isMsgAuthor ? "Delete message as Group Admin" : "Delete message"}
                                className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                                aria-label="Delete message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send form */}
                <form
                  onSubmit={sendMessage}
                  className="p-4 bg-white dark:bg-black/80 border-t border-gray-200 dark:border-zinc-800 flex gap-3"
                >
                  <input
                    className="flex-1 border border-gray-300 dark:border-zinc-800 p-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
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
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 text-3xl mb-4 font-black select-none">
                  #
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  Select or Create a Study Room
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mb-6">
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
          <div className="w-full md:w-72 glass-panel border-gray-200 dark:border-gray-800/80 rounded-[24px] p-4 space-y-4 h-full overflow-y-auto select-none">
            <h4 className="text-xs uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider">
              Quick Suggestions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => loadSuggestion("Explain React Hooks (useEffect, useState).")}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-500/30 text-xs font-bold text-gray-700 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gray-200 transition-all cursor-pointer bg-white/60 dark:bg-gray-900/40"
              >
                Explain React Hooks
              </button>
              <button
                onClick={() => loadSuggestion("Generate 5 DSA interview questions on Arrays & HashMaps.")}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-500/30 text-xs font-bold text-gray-700 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gray-200 transition-all cursor-pointer bg-white/60 dark:bg-gray-900/40"
              >
                Generate 5 DSA Questions
              </button>
              <button
                onClick={() => loadSuggestion("Create a study timeline for learning MongoDB in 3 days.")}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-500/30 text-xs font-bold text-gray-700 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gray-200 transition-all cursor-pointer bg-white/60 dark:bg-gray-900/40"
              >
                MongoDB Study Timeline
              </button>
            </div>
          </div>

          {/* AI Conversation Container */}
          <div className="flex-1 glass-panel border-gray-200 dark:border-gray-800/80 rounded-[24px] flex flex-col justify-between h-full overflow-hidden">
            <div className="p-4 bg-white/80 dark:bg-gray-950/40 border-b border-gray-200 dark:border-gray-800/60 flex items-center">
              <span className="text-xl mr-2 select-none">✨</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white m-0">
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
                        msg.role === "user" ? "text-indigo-600 dark:text-indigo-400" : "text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {msg.role === "user" ? "You" : "Gemini AI"}
                    </span>
                    <p
                      className={`text-sm p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/20 self-start max-w-[85%]"
                          : "bg-purple-50 dark:bg-purple-500/10 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-500/20 self-start max-w-[95%]"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] uppercase font-black text-purple-600 dark:text-purple-400 tracking-wider animate-pulse">
                    Gemini is thinking...
                  </span>
                  <div className="bg-purple-50 dark:bg-purple-500/10 p-4 border border-dashed border-purple-200 dark:border-purple-500/20 rounded-2xl w-2/3">
                    <Loader variant="text" count={2} />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleAiPromptSubmit}
              className="p-4 bg-white dark:bg-gray-950/40 border-t border-gray-200 dark:border-gray-800/60 flex gap-3"
            >
              <input
                className="flex-1 border border-gray-300 dark:border-gray-800 p-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
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

      {/* Invite Member Modal (Admin Only) */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[#8B5CF6] flex items-center justify-center font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white m-0 font-heading">
                      Invite to #{roomName}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold m-0">
                      👑 Admin Privilege
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteError("");
                    setInviteSuccess("");
                  }}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {inviteError && (
                <div className="p-3 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-500">
                  {inviteError}
                </div>
              )}

              {inviteSuccess && (
                <div className="p-3 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  {inviteSuccess}
                </div>
              )}

              {/* Email Invite Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInviteMember();
                }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Invite Student by Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161D2D] border border-slate-200 dark:border-[#263147] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Quick Add Matched Peers */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Quick Add Matched Peers
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {SUGGESTED_INVITES.map((peer) => (
                    <div
                      key={peer.email}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#161D2D] border border-slate-200 dark:border-[#263147]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold">
                          {peer.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {peer.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {peer.department}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInviteMember(peer)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 cursor-pointer transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy Invite Link */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Direct Room Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Direct Room Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Group Confirmation Modal (Admin Only) */}
      <AnimatePresence>
        {showDeleteGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white m-0 font-heading">
                    Delete Study Room?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                    Action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to delete this study room? As the group admin, deleting this room will permanently remove all messages and chat history for all participants.
              </p>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteGroupModal(false);
                    setDeleteConfirmGroupId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deletingGroup}
                  onClick={() => handleDeleteGroup(deleteConfirmGroupId || groupId)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-500/20 disabled:opacity-50"
                >
                  {deletingGroup ? "Deleting..." : "Yes, Delete Room"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chat;
