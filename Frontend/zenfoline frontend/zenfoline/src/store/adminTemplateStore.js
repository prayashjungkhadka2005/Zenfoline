import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAPI } from '../utils/fetchAPIs';
import useAuthStore from './userAuthStore';

const adminTemplateStore = create(
  persist(
    (set, get) => ({
      // Admin-related state
      email: '',
      username: '',
      adminId: '',
      userId: '',
      error: null,
      success: null,

      // Template-related state
      templates: [],
      loading: false,

      setSuccess: (message) => set({ success: message }),
      setUsername: (username) => set({ username }),
      setEmail: (email) => set({ email }),
      setError: (error) => set({ error }),

      // Fetching all templates
      fetchTemplates: async () => {
        set({ loading: true, error: null });
        try {
          const data = await fetchAPI('http://localhost:3000/authenticated-admin/templates');
          set({ templates: data });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // Adding or updating a template
      saveTemplate: async (template) => {
        set({ loading: true, error: null });
        try {
          const adminId = useAuthStore.getState().adminId;
          if (!adminId) {
            throw new Error('Admin ID is not available. Please log in again.');
          }

          const formData = new FormData();
          formData.append('name', template.name);
          formData.append('description', template.description || '');
          formData.append('image', template.image || '');
          formData.append('category', template.category);
          formData.append('adminId', adminId);

          const endpoint = template._id
            ? `http://localhost:3000/authenticated-admin/updatetemplate/${template._id}`
            : 'http://localhost:3000/authenticated-admin/addtemplate';

          const method = template._id ? 'PUT' : 'POST';

          await fetchAPI(endpoint, { method, body: formData });
          await get().fetchTemplates(); // Refreshing templates
          set({ success: template._id ? 'Template updated successfully!' : 'Template added successfully!' });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // Deleting a template
      deleteTemplate: async (templateId) => {
        set({ loading: true, error: null });
        try {
          await fetchAPI(`http://localhost:3000/authenticated-admin/deletetemplate/${templateId}`, {
            method: 'DELETE',
          });
          set((state) => ({
            templates: state.templates.filter((template) => template._id !== templateId),
            success: 'Template deleted successfully!',
          }));
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      resetMessages: () => set({ success: null, error: null }),

      // Adding template
      addTemplate: async (name, description, image, category) => {
        try {
          const adminId = useAuthStore.getState().adminId;
          if (!adminId) {
            throw new Error('Admin ID is not available. Please log in again.');
          }

          const formData = new FormData();
          formData.append('name', name);
          formData.append('description', description || '');
          formData.append('image', image);
          formData.append('category', category);
          formData.append('adminId', adminId);

          const response = await fetch('http://localhost:3000/authenticated-admin/addtemplate', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while adding the template.');
          }

          const data = await response.json();
          set({ error: null, success: 'Template added successfully!' });
          return data;
        } catch (err) {
          set({ error: err.message, success: null });
          throw err;
        }
      },
    }),
    {
      name: 'admin-template-store',
      storage: {
        getItem: (key) => {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);

export default adminTemplateStore;
