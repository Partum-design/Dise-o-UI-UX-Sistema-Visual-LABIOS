document.addEventListener('DOMContentLoaded', () => {
    
    // --- View Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('current-page-title');

    const titles = {
        'prototype': 'Prototipo Funcional',
        'patients': 'Directorio de Pacientes',
        'branding': 'Propuestas de Logotipo',
        'styleguide': 'Guía de Estilo Visual',
        'components': 'Componentes Reutilizables'
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide all views
            views.forEach(view => view.classList.remove('active'));
            
            // Show target view
            const targetId = item.getAttribute('data-target');
            document.getElementById(`view-${targetId}`).classList.add('active');

            // Update page title
            pageTitle.textContent = titles[targetId];
        });
    });

    // --- Theme Switcher Logic ---
    const themeBtns = document.querySelectorAll('.theme-btn');
    const body = document.body;

    // Elements to update in Style Guide based on theme
    const hexPrimary = document.getElementById('hex-primary');
    const hexSecondary = document.getElementById('hex-secondary');
    const hexAccent = document.getElementById('hex-accent');
    const hexBg = document.getElementById('hex-bg');

    const themeColors = {
        'blue': {
            primary: '#0045A6',
            secondary: '#0A1C2E',
            accent: '#1565C0',
            bg: '#F4F7F9'
        },
        'teal': {
            primary: '#007A8A',
            secondary: '#062640',
            accent: '#00A5AD',
            bg: '#F0F7F7'
        }
    };

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state of buttons
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set data-theme on body
            const themeValue = btn.getAttribute('data-theme-value');
            body.setAttribute('data-theme', themeValue);

            // Update hex values in Style Guide UI
            if(themeColors[themeValue]) {
                hexPrimary.textContent = themeColors[themeValue].primary;
                hexSecondary.textContent = themeColors[themeValue].secondary;
                hexAccent.textContent = themeColors[themeValue].accent;
                hexBg.textContent = themeColors[themeValue].bg;
            }
        });
    });

    // --- Dark Mode Logic ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (isDark) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // --- Modal Logic ---
    const modal = document.getElementById('patient-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const btnNewPatient = document.getElementById('btn-new-patient');
    const modalBodyContent = document.getElementById('modal-body-content');
    const modalTitle = document.getElementById('modal-title');
    const saveBtn = document.getElementById('save-patient-btn');

    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) closeModal();
    });

    btnNewPatient.addEventListener('click', () => {
        modalTitle.textContent = "Nuevo Paciente";
        modalBodyContent.innerHTML = `
            <div class="form-group">
                <label class="form-label">Nombre Completo</label>
                <input type="text" class="form-control" id="inp-name" placeholder="Ej. Juan Pérez">
            </div>
            <div class="form-group">
                <label class="form-label">Estudio Solicitado</label>
                <input type="text" class="form-control" id="inp-study" placeholder="Ej. Biometría Hemática">
            </div>
        `;
        openModal();
    });

    // --- Patients Data Logic ---
    const patientsTableBody = document.getElementById('patients-tbody');
    const inpSearch = document.getElementById('inp-search');
    let patients = [
        { id: '#P-001', name: 'Ana García López', date: 'Hoy, 09:30 AM', study: 'Biometría Hemática' },
        { id: '#P-002', name: 'Carlos Mendoza', date: 'Ayer', study: 'Química Sanguínea 35' },
        { id: '#P-003', name: 'Elena Rodríguez', date: '15 May 2026', study: 'Perfil Tiroideo' },
        { id: '#P-004', name: 'Luis Fernando Gómez', date: '10 May 2026', study: 'Examen de Orina' }
    ];

    const renderPatients = (filterText = '') => {
        if(!patientsTableBody) return;
        patientsTableBody.innerHTML = '';
        
        const filtered = patients.filter(p => 
            p.name.toLowerCase().includes(filterText.toLowerCase()) || 
            p.id.toLowerCase().includes(filterText.toLowerCase()) ||
            p.study.toLowerCase().includes(filterText.toLowerCase())
        );

        if(filtered.length === 0) {
            patientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No se encontraron pacientes.</td></tr>';
            return;
        }

        filtered.forEach((p, index) => {
            const tr = document.createElement('tr');
            // Adding a small stagger animation delay
            tr.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
            tr.style.opacity = '0';
            
            tr.innerHTML = `
                <td><strong>${p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.date}</td>
                <td><span class="badge badge-primary">${p.study}</span></td>
                <td>
                    <button class="btn btn-ghost hover-scale" onclick="viewPatient(${index})" style="padding: 0.5rem;"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn btn-ghost hover-scale" onclick="deletePatient(${index})" style="padding: 0.5rem; color: var(--danger);"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            patientsTableBody.appendChild(tr);
        });
    };

    if(inpSearch) {
        inpSearch.addEventListener('input', (e) => {
            renderPatients(e.target.value);
        });
    }

    // Global functions for inline onclick handlers
    window.viewPatient = (index) => {
        const p = patients[index];
        modalTitle.textContent = "Detalle de Paciente";
        modalBodyContent.innerHTML = `
            <p><strong>Expediente:</strong> ${p.id}</p>
            <p><strong>Nombre:</strong> ${p.name}</p>
            <p><strong>Última Visita:</strong> ${p.date}</p>
            <p><strong>Estudio Activo:</strong> ${p.study}</p>
            <div class="mt-4" style="padding: 1rem; background: var(--bg-color); border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                <i class="fa-solid fa-file-pdf" style="color: var(--danger);"></i> Resultados.pdf
                <button class="btn btn-outline" style="float: right; padding: 0.2rem 0.5rem; font-size: 0.8rem;">Descargar</button>
            </div>
        `;
        openModal();
    };

    window.deletePatient = (index) => {
        if(confirm("¿Eliminar expediente?")) {
            patients.splice(index, 1);
            renderPatients();
        }
    };

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('inp-name')?.value || "Paciente Nuevo";
            const study = document.getElementById('inp-study')?.value || "Estudio General";
            const id = `#P-00${patients.length + 1}`;
            patients.push({ id, name, date: 'Ahora', study });
            renderPatients();
            closeModal();
        });
    }

    // Initial render
    renderPatients();

});
