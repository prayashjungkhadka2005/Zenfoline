import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAPI } from '../utils/fetchAPIs';

const useTemplateStore = create(
  persist(
    (set) => ({
      templates: [], //stores all templates
      activeTemplateId: null, //stores active templates
      loading: false, 
      error: null,

      // fetching all templates and active templates
      fetchTemplates: async (userId) => {
        set({ loading: true, error: null });
        try {
        
          const templates = await fetchAPI('http://localhost:3000/authenticated-user/templates');

          const userResponse = await fetchAPI(
            `http://localhost:3000/authenticated-user/getactivetemplate?userId=${userId}`
          );

          const activeTemplateId = userResponse.activeTemplateId || null;

          const sortedTemplates = templates.sort((a, b) => {
            if (a._id === activeTemplateId) return -1;
            if (b._id === activeTemplateId) return 1;
            return 0;
          });

          set({ templates: sortedTemplates, activeTemplateId, error: null });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      activateTemplate: async (templateId, userId) => {
        try {
          await fetchAPI('http://localhost:3000/authenticated-user/activateusertemplate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId, userId }),
          });

          // Updating active templates and reordering templates
          set((state) => {
            const updatedTemplates = state.templates.sort((a, b) => {
              if (a._id === templateId) return -1;
              if (b._id === templateId) return 1;
              return 0;
            });
            return { templates: updatedTemplates, activeTemplateId: templateId, error: null };
          });
        } catch (err) {
          set({ error: err.message });
        }
      },
    }),
    {
      name: 'user-template-store',
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

export default useTemplateStore;
