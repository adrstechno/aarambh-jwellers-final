/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  getReels,
  createReel,
  updateReel,
  deleteReel,
  reorderReels,
} from "../../api/reelApi.js";
import {
  Trash2,
  Plus,
  GripVertical,
  Edit2,
  Upload,
  X,
  Save,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminReels() {
  const [reels, setReels] = useState([]);
  const [newReel, setNewReel] = useState({
    title: "",
    videoUrl: "",
    thumbnail: "",
    videoFile: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    videoUrl: "",
    thumbnail: "",
    videoFile: null,
  });

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    const data = await getReels();
    setReels(data || []);
  };

  /* =====================================================
     🟢 Add New Reel
  ===================================================== */
  const handleAddReel = async () => {
    if (!newReel.title || (!newReel.videoUrl && !newReel.videoFile))
      return toast.error("Please provide a title and video (file or URL)");

    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", newReel.title);
    if (newReel.videoFile) formData.append("video", newReel.videoFile);
    if (newReel.videoUrl) formData.append("videoUrl", newReel.videoUrl);
    if (newReel.thumbnail) formData.append("thumbnail", newReel.thumbnail);

    const loadingToast = toast.loading("Uploading new reel...");
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/reels`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.dismiss(loadingToast);
      toast.success("✅ Reel added successfully!");
      setNewReel({ title: "", videoUrl: "", thumbnail: "", videoFile: null });
      fetchReels();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("❌ Error adding reel:", err);
      toast.error("Failed to add reel");
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
     ✏️ Open Edit Modal
  ===================================================== */
  const openEditModal = (reel) => {
    setEditingReel(reel);
    setEditForm({
      title: reel.title,
      videoUrl: reel.videoUrl,
      thumbnail: reel.thumbnail || "",
      videoFile: null,
    });
  };

  /* =====================================================
     💾 Save Edit Changes
  ===================================================== */
  const handleSaveEdit = async () => {
    if (!editingReel) return;

    const formData = new FormData();
    formData.append("title", editForm.title);
    if (editForm.videoFile) formData.append("video", editForm.videoFile);
    else formData.append("videoUrl", editForm.videoUrl);
    formData.append("thumbnail", editForm.thumbnail);

    const loadingToast = toast.loading("Saving changes...");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/reels/${editingReel._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.dismiss(loadingToast);
      toast.success("✅ Reel updated successfully!");
      setEditingReel(null);
      fetchReels();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("❌ Error updating reel:", err);
      toast.error("Failed to update reel");
    }
  };

  /* =====================================================
     🗑 Delete Reel
  ===================================================== */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this reel?")) {
      const loadingToast = toast.loading("Deleting reel...");
      try {
        await deleteReel(id);
        toast.dismiss(loadingToast);
        toast.success("🗑️ Reel deleted successfully!");
        fetchReels();
      } catch (err) {
        toast.dismiss(loadingToast);
        console.error("❌ Failed to delete reel:", err);
        toast.error("Failed to delete reel");
      }
    }
  };

  /* =====================================================
     🔁 Reorder Reels (with toast)
  ===================================================== */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(reels);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // ✅ Reassign order
    const updated = reordered.map((r, i) => ({ _id: r._id, order: i }));
    setReels(reordered);

    const loadingToast = toast.loading("Updating reel order...");
    try {
      await reorderReels(updated);
      toast.dismiss(loadingToast);
      toast.success("✅ Reel order updated successfully!");
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("❌ Failed to reorder reels:", err);
      toast.error("Failed to update reel order!");
    }
  };

  /* =====================================================
     🖼 UI
  ===================================================== */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🎬 Manage Trending Reels</h1>

      {/* Add Reel Form */}
      <div className="bg-white p-5 rounded-lg shadow mb-8 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus size={18} /> Add New Reel
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            value={newReel.title}
            onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Video URL (optional)"
            value={newReel.videoUrl}
            onChange={(e) => setNewReel({ ...newReel, videoUrl: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setNewReel({ ...newReel, videoFile: e.target.files[0], videoUrl: "" })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Thumbnail URL (optional)"
            value={newReel.thumbnail}
            onChange={(e) =>
              setNewReel({ ...newReel, thumbnail: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={handleAddReel}
          disabled={isSaving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Upload size={16} />
          {isSaving ? "Uploading..." : "Upload Reel"}
        </button>
      </div>

      {/* Reel List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="reels">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {reels.map((reel, index) => (
                <Draggable key={reel._id} draggableId={reel._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-4 bg-white p-3 rounded-lg shadow border"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="text-gray-400 cursor-grab" />
                      </div>

                      <video
                        src={reel.videoUrl}
                        className="w-24 h-24 object-cover rounded-lg border"
                        muted
                        loop
                        playsInline
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{reel.title}</h3>
                        <p className="text-xs text-gray-500 truncate">
                          {reel.videoUrl}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(reel)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(reel._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Modal */}
      {editingReel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setEditingReel(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit2 size={18} /> Edit Reel
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="Video URL"
                value={editForm.videoUrl}
                onChange={(e) =>
                  setEditForm({ ...editForm, videoUrl: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    videoFile: e.target.files[0],
                    videoUrl: "",
                  })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="Thumbnail URL"
                value={editForm.thumbnail}
                onChange={(e) =>
                  setEditForm({ ...editForm, thumbnail: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditingReel(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
