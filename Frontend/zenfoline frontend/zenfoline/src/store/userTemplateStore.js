import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAPI } from '../utils/fetchAPIs';

const useTemplateStore = create(
  persist(
    (set, get) => ({
      templates: [], //stores all templates
      activeTemplateId: null, //stores active templates
      loading: false, 
      error: null,

      // fetching all templates and active templates
      fetchTemplates: async (userId) => {
        // Get current state
        const currentState = get();
        
        // If templates are already loaded and we have an activeTemplateId, don't fetch again
        if (currentState.templates.length > 0 && currentState.activeTemplateId) {
          return;
        }
        
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

      fetchActiveTemplate: async (userId) => {
        try {
          const response = await fetch(
            `http://localhost:3000/authenticated-user/activetemplate?userId=${userId}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch active template');
          }
          const activeTemplate = await response.json();
          set({ activeTemplateId: activeTemplate._id });
          return activeTemplate;
        } catch (err) {
          console.error(err.message);
          return null;
        }
      },
      

      activateTemplate: async (templateId, userId) => {
        try {
          await fetchAPI('http://localhost:3000/authenticated-user/activateusertemplate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId, userId }),
          });

          
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

      updateTheme: async(templateId, userId) => {
        try {
          const response = await fetch('http://localhost:3000/authenticated-user/updatetheme', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              templateId, 
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to update theme database.');
          }
    
          console.log('Theme updated successfully');
        } catch (err) {
          console.error('Error updating theme:', err.message);
        }
      }
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
