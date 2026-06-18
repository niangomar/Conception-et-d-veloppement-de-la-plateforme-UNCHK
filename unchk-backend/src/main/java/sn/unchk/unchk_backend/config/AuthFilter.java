package sn.unchk.unchk_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sn.unchk.unchk_backend.repository.UtilisateurRepository;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // ✅ Log temporaire pour déboguer (à supprimer après)
        System.out.println(">>> PATH reçu : [" + path + "]");

        // ✅ Laisser passer les requêtes OPTIONS (pré-vol CORS)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Laisser passer toutes les routes qui ne commencent pas par /api/utilisateurs
        if (!path.startsWith("/api/utilisateurs")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Laisser passer login et inscription (startsWith pour éviter les problèmes de slash final)
        if (path.startsWith("/api/utilisateurs/login") ||
                path.startsWith("/api/utilisateurs/inscription")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Vérifier les headers
        String userEmail = request.getHeader("X-User-Email");
        String userRole  = request.getHeader("X-User-Role");

        if (userRole == null || userEmail == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Non autorise - connectez-vous !");
            return;
        }

        // ✅ Vérifier en base que cet email est bien un admin actif
        boolean isRealAdmin = utilisateurRepository.findByEmail(userEmail)
                .map(u ->
                        u.getActif() != null && u.getActif() &&
                                (u.getRole().equals("admin") || u.getRole().equals("administratif"))
                )
                .orElse(false);

        if (!isRealAdmin) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Acces interdit - reserve aux administrateurs !");
            return;
        }

        filterChain.doFilter(request, response);
    }
}